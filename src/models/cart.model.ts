import Model from "../config/objection-config";
import User from "./user.model";
import Product from "./product.model";

class Cart extends Model {
  id!: number;
  user_id!: number;
  product_id!: number;
  quantity!: number;
  user?: User;
  product?: Product;

  static get tableName() {
    return "cart";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "product_id", "quantity"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        product_id: { type: "integer" },
        quantity: { type: "integer", minimum: 1 },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "cart.user_id",
          to: "users.id",
        },
      },
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: "cart.product_id",
          to: "products.id",
        },
      },
    };
  }
}

export default Cart;