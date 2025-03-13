import knex from 'knex';
import knexConfig from './knex-config';

const environment = process.env.NODE_ENV;
const config = knexConfig[environment];

const knexConnection = knex(config);

export default knexConnection;