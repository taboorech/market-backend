import { CustomError } from "../libs/classes/custom-error.class";
import Category from "../models/category.model";

type CategoryInput = string;
type CategoryWithParentInput = { category: string, parentId?: number };

const createCategory = async (categoryInput: CategoryInput | CategoryWithParentInput): Promise<Category | void> => {
  await Category.transaction(async trx => {
    const category = typeof categoryInput === 'string' ? { category: categoryInput } : categoryInput;
    const { category: categoryTitle, parentId } = category;
  
    const foundCategory = await Category.query(trx)
      .where('title', categoryTitle)
      .first();
  
    if(foundCategory) {
      throw new CustomError(403, 'Category is available');
    }
  
    let parentRight: number;
  
    if (parentId) {
      const parentCategory = await Category.query(trx).findById(parentId);
      if (!parentCategory) throw new CustomError(404, 'Parent category not found');
      parentRight = parentCategory.right;
    } else {
      const maxRightResult = await Category.query(trx).max('right').first();
      parentRight = maxRightResult?.right || 0;
    }
  
    await Category.query(trx).where('right', '>=', parentRight).increment('right', 2);
    await Category.query(trx).where('left', '>=', parentRight).increment('left', 2);
  
    return await Category.query(trx).insert({
      title: categoryTitle,
      left: parentRight,
      right: parentRight + 1,
    });
  })
}

const findOrCreateCategory = async (categoryInput: CategoryInput | CategoryWithParentInput): Promise<Category> => {
  return await Category.transaction(async trx => {
    const results: Category[] = [];

    const categories = [categoryInput];
    
    for (const item of categories) {
      const category = typeof item === 'string' ? { category: item } : item;
      const { category: categoryTitle, parentId } = category;

      let foundCategory = await Category.query(trx)
        .where('title', categoryTitle)
        .first();

      if (!foundCategory) {
        let parentRight: number;

        if (parentId) {
          const parentCategory = await Category.query(trx).findById(parentId);
          if (!parentCategory) throw new CustomError(404, 'Parent category not found');
          parentRight = parentCategory.right;
        } else {
          const maxRightResult = await Category.query(trx).max('right').first();
          parentRight = maxRightResult?.right || 0;
        }

        await Category.query(trx).where('right', '>=', parentRight).increment('right', 2);
        await Category.query(trx).where('left', '>=', parentRight).increment('left', 2);

        foundCategory = await Category.query(trx).insert({
          title: categoryTitle,
          left: parentRight,
          right: parentRight + 1,
        });
      }

      results.push(foundCategory);
    }

    return results[0];
  });
};


export { createCategory, findOrCreateCategory };