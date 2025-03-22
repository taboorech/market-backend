import type { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  await knex.schema.createTable("attribute_groups", (table) => {
    table.increments("id").notNullable().primary();
    table.string("title").notNullable();
    table.timestamps(true, true);
  });

export const down = async (knex: Knex): Promise<void> =>
  await knex.schema.dropTable("attribute_groups");
