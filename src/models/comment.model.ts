import Model from "../config/objection-config";
import User from "./user.model";
import Product from "./product.model";

class Comment extends Model {
  id!: number;
  user_id!: number;
  product_id!: number;
  content!: string;
  created_at!: string;
  updated_at!: string;

  user?: User;
  product?: Product;

  static get tableName() {
    return "comments";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "product_id", "content"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        product_id: { type: "integer" },
        content: { type: "string", minLength: 1 },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "comments.user_id",
          to: "users.id",
        },
      },
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: "comments.product_id",
          to: "products.id",
        },
      },
    };
  }
}

export default Comment;