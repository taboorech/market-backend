import type { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  await knex.schema.createTable("product_attributes", (table) => {
    table.increments("id").notNullable().primary();
    table
      .integer("product_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table
      .integer("attribute_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("attributes")
      .onDelete("CASCADE");
    table.string("value").notNullable();
    table.timestamps(true, true);
  });

export const down = async (knex: Knex): Promise<void> =>
  await knex.schema.dropTable("product_attributes");