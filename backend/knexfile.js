// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user:     'root',
      password: 'luisa2008',
      database: 'projeto_db'
    },
    pool: {
      min: 2,
      max: 10
    }

};
