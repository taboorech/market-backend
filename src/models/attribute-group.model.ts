import Model from "../config/objection-config";
import Attribute from "./attribute.model";

class AttributeGroup extends Model {
  id!: number;
  title!: string;
  attributes?: Attribute[];

  static get tableName() {
    return "attribute_groups";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title"],
      properties: {
        id: { type: "integer" },
        title: { type: "string", minLength: 1 },
      },
    };
  }

  static get relationMappings() {
    return {
      attributes: {
        relation: Model.HasManyRelation,
        modelClass: Attribute,
        join: {
          from: "attribute_groups.id",
          to: "attributes.group_id",
        },
      },
    };
  }
}

export default AttributeGroup;