import Model from "../config/objection-config";
import AttributeGroup from "./attribute-group.model";
import ProductAttribute from "./product-attribute.model";

class Attribute extends Model {
  id!: number;
  title!: string;
  group_id!: number;
  group?: AttributeGroup;
  productAttributes?: ProductAttribute[];

  static get tableName() {
    return "attributes";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title"],
      properties: {
        id: { type: "integer" },
        title: { type: "string", minLength: 1 },
        group_id: { type: "integer" },
      },
    };
  }

  static get relationMappings() {
    return {
      group: {
        relation: Model.BelongsToOneRelation,
        modelClass: AttributeGroup,
        join: {
          from: "attributes.group_id",
          to: "attribute_groups.id",
        },
      },
      productAttributes: {
        relation: Model.HasManyRelation,
        modelClass: ProductAttribute,
        join: {
          from: "attributes.id",
          to: "product_attributes.attribute_id",
        },
      },
    };
  }
}

export default Attribute;