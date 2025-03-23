import Model from "../config/objection-config";
import Attribute from "./attribute.model";
import Product from "./product.model";

class ProductAttribute extends Model {
  id!: number;
  product_id!: number;
  attribute_id!: number;
  value!: string;
  attribute?: Attribute;
  product?: Product;

  static get tableName() {
    return "product_attributes";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["product_id", "attribute_id", "value"],
      properties: {
        id: { type: "integer" },
        product_id: { type: "integer" },
        attribute_id: { type: "integer" },
        value: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    return {
      attribute: {
        relation: Model.BelongsToOneRelation,
        modelClass: Attribute,
        join: {
          from: "product_attributes.attribute_id",
          to: "attributes.id",
        },
      },
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: "product_attributes.product_id",
          to: "products.id",
        },
      },
    };
  }
}

export default ProductAttribute;