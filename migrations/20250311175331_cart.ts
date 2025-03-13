import type { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => 
  await knex.schema.createTable("cart", (table) => {
    table.increments("id").notNullable().primary();
    table.integer("user_id").unsigned().notNullable()
      .references("id").inTable("users").onDelete("CASCADE");
    table.integer("product_id").unsigned().notNullable()
      .references("id").inTable("products").onDelete("CASCADE");
    table.integer("quantity").unsigned().notNullable().defaultTo(1);
    table.timestamps(true, true);
  });

export const down = async (knex: Knex): Promise<void> =>
  await knex.schema.dropTable("cart");