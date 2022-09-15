// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const {
  NODE_ENV = "development",
  DATABASE_URL,
  PRODUCTION_DATABASE_URL
} = process.env

const URL = 
  NODE_ENV === "production" ?
  PRODUCTION_DATABASE_URL :
  DATABASE_URL

module.exports = {

  development: {
    client: 'postgresql',
    connection: URL,
    migrations: {
      directory: __dirname + "/src/db/migrations"
    },
    seeds: {
      directory: __dirname + "/src/db/seeds" 
    },

  },

  production: {
    client: 'postgresql',
    connection: URL,
    migrations: {
      directory: __dirname + "/src/db/migrations"
    },
    seeds: {
      directory: __dirname + "/src/db/seeds" 
    },
  }

};
