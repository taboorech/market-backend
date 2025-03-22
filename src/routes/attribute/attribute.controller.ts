import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Category from '../../models/category.model';
import { getAllCategoriesValidation } from '../../yup/category.scheme';
import AttributeGroup from '../../models/attribute-group.model';
import { createAttributeValidation, createGroupValidation, getAttributesByGroupValidation, getGroupsValidation } from '../../yup/attribute.scheme';
import Attribute from '../../models/attribute.model';

const createGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { title, attributes } = await createGroupValidation.validate(req.body, { abortEarly: false });

  await AttributeGroup.query().insertGraph({
    title,
    attributes: attributes?.map((title) => ({ title })) || [],
  });

  res.sendStatus(201);
});

const createAttribute = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { title, group_id } = await createAttributeValidation.validate(req.body, { abortEarly: false });

  const attribute = await Attribute.query().insert({
    title,
    group_id
  });

  res.status(201).json(attribute);
});

const getGroups = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { offset, limit, search, ids } = await getGroupsValidation.validate(req.query, { abortEarly: false });

  console.log(ids);
  

  const groupsRequest = AttributeGroup
    .query()
    .modify(builder => {
      if (search) {
        builder.whereILike("title", `%${search}%`);
      }
      
      if(ids) {
        builder.whereIn('id', ids);
      }
    });

  const total = await groupsRequest.resultSize();
  const data = await groupsRequest
    .offset(offset)
    .limit(limit)
    .withGraphFetched("attributes");

  res.json({ 
    total, 
    data 
  });
});

const getAttributesByGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { group_id, offset, limit, search, ids } = await getAttributesByGroupValidation.validate(req.query, { abortEarly: false });

  const attributesRequest = Attribute
    .query()
    .where("group_id", group_id)
    .modify(builder => {
      if(search) {
        builder.whereILike('title', `%${search}%`);
      }
      if(ids) {
        builder.whereIn('id', ids);
      }
    });

  const total = await attributesRequest.resultSize();
  const data = await attributesRequest.offset(offset).limit(limit);

  res.json({ total, data });
});

export { createGroup, createAttribute, getGroups, getAttributesByGroup }