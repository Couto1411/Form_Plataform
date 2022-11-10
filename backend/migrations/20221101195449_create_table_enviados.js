exports.up = function(knex, Promise) {
    return knex.schema.createTable('enviados', table=>{
        table.increments('id').primary()
        table.integer('formId').unsigned().references('id').inTable('formularios')
        table.boolean('respondido').notNullable().defaultTo(false)
        table.string('email').notNull()
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('enviados')
};
