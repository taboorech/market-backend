import Model from "../config/objection-config";
import Product from "./product.model";

class ProductsImages extends Model {
  id!: number;
  product_id!: number;
  path!: string;
  product: Product;

  static get tableName() {
    return 'products_images';
  }

  static get relationMappings() {
    return {
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'products_images.product_id',
          to: 'products.id',
        },
      },
    };
  }
}

export default ProductsImages;