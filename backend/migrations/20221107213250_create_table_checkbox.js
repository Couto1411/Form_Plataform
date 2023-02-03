exports.up = function(knex, Promise) {
    return knex.schema.createTable('checkbox', table=>{
        table.increments('id').primary()
        table.integer('questaoId').unsigned().references('id').inTable('questoes').notNull()
        table.integer('respostaId').unsigned().references('id').inTable('enviados').notNull()
        table.boolean('opcao1')
        table.boolean('opcao2')
        table.boolean('opcao3')
        table.boolean('opcao4')
        table.boolean('opcao5')
        table.boolean('opcao6')
        table.boolean('opcao7')
        table.boolean('opcao8')
        table.boolean('opcao9')
        table.boolean('opcao10')
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('checkbox')
};
