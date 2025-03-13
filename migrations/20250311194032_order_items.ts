import type { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => 
  await knex.schema.createTable("order_items", (table) => {
    table.increments("id").notNullable().primary();
    table.integer("order_id").unsigned().notNullable()
      .references("id").inTable("orders").onDelete("CASCADE");
    table.integer("product_id").unsigned().notNullable()
      .references("id").inTable("products").onDelete("CASCADE");
    table.integer("quantity").unsigned().notNullable().defaultTo(1);
    table.decimal("price", 10, 2).notNullable();
    table.timestamps(true, true);
  });

export const down = async (knex: Knex): Promise<void> =>
  await knex.schema.dropTable("order_items");
