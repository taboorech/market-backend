import type { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  await knex.schema.createTable("comments", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable()
      .references("id").inTable("users").onDelete("CASCADE");
    table.integer("product_id").unsigned().notNullable()
      .references("id").inTable("products").onDelete("CASCADE");
    table.text("content").notNullable();
    table.timestamps(true, true);
  });

export const down = async (knex: Knex): Promise<void> =>
  await knex.schema.dropTable("comments");