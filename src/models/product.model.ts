import Model from "../config/objection-config";
import Category from "./category.model";
import ProductsImages from "./product-images.model";
import User from "./user.model";

class Product extends Model {

  id!: number;
  title!: string;
  description?: string;
  category_id!: number;
  price!: number;
  seller_id?: number;
  updated_at: string;
  category: Category;
  user: User;
  images: ProductsImages[];
  main_image?: number;
  upc?: string;
  
  static get tableName() {
    return 'products';
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'products.seller_id',
          to: 'users.id',
        },
      },
      images: {
        relation: Model.HasManyRelation,
        modelClass: ProductsImages,
        join: {
          from: 'products.id',
          to: 'products_images.product_id',
        },
      },
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: 'products.category_id',
          to: 'categories.id',
        },
      }
    };
  }
}

export default Product;