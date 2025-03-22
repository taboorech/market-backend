import type { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  await knex.schema.createTable("attributes", (table) => {
    table.increments("id").notNullable().primary();
    table.string("title").notNullable();
    table
      .integer("group_id")
      .unsigned()
      .references("id")
      .inTable("attribute_groups")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });

export const down = async (knex: Knex): Promise<void> =>
  await knex.schema.dropTable("attributes");
