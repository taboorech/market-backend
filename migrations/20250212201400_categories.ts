import type { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => 
  await knex.schema.createTable('categories', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.integer('left').notNullable();
    table.integer('right').notNullable();
    table.timestamps(true, true);
  });

export const down = async (knex: Knex): Promise<void> =>
  await knex.schema.dropTable('categories');