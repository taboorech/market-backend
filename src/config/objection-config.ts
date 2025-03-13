import { Model } from "objection";
import knexConnection from "./knex-connection";

Model.knex(knexConnection);

export default Model;