const knex = require('knex')({
    client: 'pg',
    version: '7.2',
    connection: {
      host : 'localhost',
      user : 'postgres',
      password : 'test',
      database : 'musicroom'
    }
});

export default knex