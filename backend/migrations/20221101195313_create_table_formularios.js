exports.up = function(knex, Promise) {
    return knex.schema.createTable('formularios', table=>{
        table.increments('id').primary()
        table.string('titulo').notNull()
        table.integer('responsavelId').unsigned().references('id').inTable('users')
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('formularios')
};
