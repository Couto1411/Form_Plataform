exports.up = function(knex, Promise) {
    return knex.schema.createTable('questoes', table=>{
        table.increments('id').primary()
        table.integer('numero').unsigned().notNull()
        table.integer('type').notNull()
        table.integer('formId').unsigned().references('id').inTable('formularios')
        table.string('enunciado').notNull()
        table.string('opcao1')
        table.string('opcao2')
        table.string('opcao3')
        table.string('opcao4')
        table.string('opcao5')
        table.string('opcao6')
        table.string('opcao7')
        table.string('opcao8')
        table.string('opcao9')
        table.string('opcao10')
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('questoes')
};
