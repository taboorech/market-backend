import type { Knex } from "knex";
import { UserRole } from "../src/libs/enum/user-role.enum";

export const up = async (knex: Knex): Promise<void> => 
  await knex.schema.createTable('users', table => {
    table.increments('id').notNullable().primary();
    table.string('email').notNullable().unique();
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.string('image').nullable();
    table.enu('role', Object.values(UserRole)).notNullable().defaultTo(UserRole.USER);
    table.string('password').notNullable();
    table.string('refreshToken').nullable();
    table.timestamps(true, true);
  })


export const down = async (knex: Knex): Promise<void> => 
  await knex.schema.dropTable('users');