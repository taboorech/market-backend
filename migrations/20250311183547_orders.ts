import type { Knex } from "knex";
import { OrderStatus } from "../src/libs/enum/order-status.enum";

export const up = async (knex: Knex): Promise<void> => 
  await knex.schema.createTable("orders", (table) => {
    table.increments("id").notNullable().primary();
    table.integer("user_id").unsigned().notNullable()
      .references("id").inTable("users").onDelete("CASCADE");
    table.decimal("total_price", 10, 2).notNullable();
    table.enu("status", Object.values(OrderStatus))
      .notNullable().defaultTo("pending");
    table.timestamps(true, true);
  });

export const down = async (knex: Knex): Promise<void> =>
  await knex.schema.dropTable("orders");