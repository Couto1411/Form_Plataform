exports.up = function(knex, Promise) {
    return knex.schema.createTable('text', table=>{
        table.increments('id').primary()
        table.integer('questaoId').unsigned().references('id').inTable('questoes').notNull()
        table.integer('respostaId').unsigned().references('id').inTable('enviados').notNull()
        table.string('texto')
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('text')
};
