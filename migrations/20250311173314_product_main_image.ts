import type { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.table('products', table => {
    table.integer('main_image').unsigned().nullable().references('id').inTable('products_images').onDelete('SET NULL');
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.table('products', table => {
    table.dropColumn('main_image');
  });
};