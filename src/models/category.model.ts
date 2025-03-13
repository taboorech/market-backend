import Model from "../config/objection-config";
import Product from "./product.model";

class Category extends Model {
  id!: number;
  title!: string;
  left!: number;
  right!: number;
  products?: Product[];

  static get tableName() {
    return 'categories';
  }

  static get relationMappings() {
    return {
      products: {
        relation: Model.HasManyRelation,
        modelClass: Product,
        join: {
          from: 'categories.id',
          to: 'products.category_id',
        },
      }
    };
  }
}

export default Category;