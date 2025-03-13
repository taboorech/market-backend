import Model from "../config/objection-config";
import Order from "./order.model";
import Product from "./product.model";

class OrderItem extends Model {
  id!: number;
  order_id!: number;
  product_id!: number;
  quantity!: number;
  price!: number;
  order?: Order;
  product?: Product;

  static get tableName() {
    return "order_items";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["order_id", "product_id", "quantity", "price"],
      properties: {
        id: { type: "integer" },
        order_id: { type: "integer" },
        product_id: { type: "integer" },
        quantity: { type: "integer", minimum: 1 },
        price: { type: "number", minimum: 0 },
      },
    };
  }

  static get relationMappings() {
    return {
      order: {
        relation: Model.BelongsToOneRelation,
        modelClass: Order,
        join: {
          from: "order_items.order_id",
          to: "orders.id",
        },
      },
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: "order_items.product_id",
          to: "products.id",
        },
      },
    };
  }
}

export default OrderItem;