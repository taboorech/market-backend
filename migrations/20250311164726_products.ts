import type { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => 
  await knex.schema.createTable('products', table => {
    table.increments('id').notNullable().primary();
    table.string('title').notNullable();
    table.string('description').nullable();
    table.decimal('price', 10, 2).notNullable();
    table.integer('category_id').unsigned().notNullable()
    .references('id').inTable('categories').onDelete('CASCADE');
    table.integer('seller_id').unsigned().notNullable()
    .references('id').inTable('users').onDelete('CASCADE');
    table.string('UPC').nullable();
    table.timestamps(true, true);
  });

export const down = async (knex: Knex): Promise<void> =>
  await knex.schema.dropTable('products');