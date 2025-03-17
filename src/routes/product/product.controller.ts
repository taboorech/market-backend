import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Product from '../../models/product.model';
import { createProductValidation, getAllProductsValidation, getProductsByCategoryValidation, manageCartValidation } from '../../yup/product.scheme';
import ProductsImages from '../../models/product-images.model';
import { basename } from 'path';
import Cart from '../../models/cart.model';
import { CustomError } from '../../libs/classes/custom-error.class';
import { ManageCartType } from '../../libs/enum/manage-cart-type.enum';

const getAllProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { offset, limit, search, ids } = await getAllProductsValidation.validate(req.query, { abortEarly: false });

  const productsQuery = Product
    .query()
    .withGraphFetched("[user, images]")
    .modifyGraph('user', builder =>
      builder.select('id', 'firstName', 'lastName')
    )
    .modify(builder => {
      if(search)
        builder.whereILike('title', `%${search}%`)

      if(ids)
        builder.whereIn('id', ids);
    });

  const products = await productsQuery.offset(offset).limit(limit);
  const total = await productsQuery.resultSize();

  res.json({
    total,
    data: products
  });
});

const getProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const product = await Product.query()
    .findById(id)
    .withGraphFetched('[user, images]')
    .modifyGraph('user', builder =>
      builder.select('id', 'firstName', 'lastName')
    );

  if(!product)
    throw new CustomError(404, 'Product not found');

  res.json(product);
});

const createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const {
    main_image,
    ...validValues
   } = 
    await createProductValidation.validate({
      ...req.body, 
      seller_id: req.user.id
    }, { abortEarly: false });

  const product = await Product.query().insert(validValues);

  if (req.files && Array.isArray(req.files) && req.files.length) {
    const serverHost = `${req.protocol}://${req.get("host")}`;

    const filesToInsert = [];

    for(const file of req.files) {
      filesToInsert.push({
        path: `${serverHost}/${file.filename}`,
        product_id: product.id
      });
    }

    await ProductsImages.transaction(async trx => {
      await ProductsImages
        .query(trx)
        .toKnexQuery()
        .insert(filesToInsert)
        .onConflict()
        .ignore();
    });

    if (main_image) {
      const mainImageOriginalname = req.files.find(({ originalname }) => originalname === main_image).filename;

      const mainImageUrl = filesToInsert.find(({ path: url }) => 
        basename(url) === mainImageOriginalname
      );
    
      if (mainImageUrl) {
        const mainImage = await ProductsImages.query().findOne({ 
          product: product.id, 
          path: mainImageUrl 
        });
    
        if (mainImage) {
          await product.$query().patchAndFetch({ main_image: mainImage.id });
        }
      }
    }
  }

  res.sendStatus(201);
});

const getProductsByCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { category, offset, limit } = await getProductsByCategoryValidation.validate({...req.params, ...req.query}, { abortEarly: false });

  const productsRequest = Product.query()
    .where("category_id", category)
    .withGraphFetched("images")

  const total = await productsRequest.resultSize();
  const products = await productsRequest.offset(offset).limit(limit);

  res.json({
    total,
    data: products
  });
});

const manageCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.id;

  const { product: productId, type, quantity } = await manageCartValidation.validate({...req.body, ...req.params}, { abortEarly: false });

  const product = await Product.query().findById(productId);
  if (!product) {
    throw new CustomError(404, "Product not found");
  }

  const existingCartItem = await Cart.query()
    .where({ user_id: userId, product_id: productId })
    .first();

  switch(type) {
    case ManageCartType.REMOVE:
      if (existingCartItem) {
        if (existingCartItem.quantity > quantity) {
          await existingCartItem.$query().patch({ quantity: existingCartItem.quantity - quantity });
          res.sendStatus(200);

          return;
        } 
        
        await existingCartItem.$query().delete();
        res.sendStatus(200);

        return;
      }

      throw new CustomError(404, 'No product found');
    case ManageCartType.ADD:
    default:
      if(existingCartItem) {
        await existingCartItem.$query().patch({ quantity: existingCartItem.quantity + quantity });
    
        res.sendStatus(200);
        return;
      }
      
      await Cart.query().insert({
        user_id: userId,
        product_id: productId,
        quantity,
      });

      break;
  }

  res.sendStatus(200);
});

export { getAllProducts, getProduct, createProduct, getProductsByCategory, manageCart };