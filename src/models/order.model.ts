import Model from "../config/objection-config";
import { OrderStatus } from "../libs/enum/order-status.enum";
import OrderItem from "./order-item.model";
import User from "./user.model";

class Order extends Model {
  id!: number;
  user_id!: number;
  total_price!: number;
  status!: OrderStatus;
  user?: User;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;

  static get tableName() {
    return "orders";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "total_price", "status"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        total_price: { type: "number", minimum: 0 },
        status: { type: "string", enum: Object.values(OrderStatus) },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" }
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "orders.user_id",
          to: "users.id",
        },
      },
      items: {
        relation: Model.HasManyRelation,
        modelClass: OrderItem,
        join: {
          from: "orders.id",
          to: "order_items.order_id",
        },
      },
    };
  }
}

export default Order;