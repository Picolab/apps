module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : process.env.DATABASE_PASSWORD || '', //When running node server.js, this is configured from the command line
      database : 'apps',
      charset: 'utf8'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : process.env.DATABASE_PASSWORD || '', //When running node server.js, this is configured from the command line
      database : 'apps',
      charset: 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
