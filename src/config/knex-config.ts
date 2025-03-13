import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.KNEX_HOST,
      user: process.env.KNEX_USER,
      password: process.env.KNEX_PASSWORD,
      database: process.env.KNEX_DB
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/migrations'
    }
  }
};

export default config;