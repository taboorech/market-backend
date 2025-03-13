import type { Knex } from "knex";


export const up = async (knex: Knex): Promise<void> => 
  await knex.schema.createTable('products_images', table => {
    table.increments('id').primary();
    table.integer('product_id').unsigned().notNullable().references('id').inTable('products').onDelete('CASCADE');
    table.string('path').notNullable();
  });


export const down = async (knex: Knex): Promise<void> => 
  await knex.schema.dropTable('products_images');