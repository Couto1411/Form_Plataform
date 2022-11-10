exports.up = function(knex, Promise) {
    return knex.schema.createTable('radiobox', table=>{
        table.increments('id').primary()
        table.integer('questaoId').unsigned().references('id').inTable('questoes')
        table.integer('repostaId').unsigned().references('id').inTable('enviados')
        table.string('radio')
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('radiobox')
};
