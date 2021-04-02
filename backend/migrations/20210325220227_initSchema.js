require("@babel/register");
const statusTransferencia = require('../src/enums/transferencia')
const statusContato = require('../src/enums/contato')

const createdAt = (knex, table) => table.timestamp('createdAt', { precision: 3 })
  .notNullable()
  .defaultTo(knex.fn.now(3));

const updatedAt = (knex, table) => table.timestamp('updatedAt', { precision: 3 })
  .notNullable()
  .defaultTo(knex.raw('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'));

/**
 * @param {import('knex')} knex
*/
exports.up = async function(knex) {
    
    /** TABLE usuario */
    await knex.schema.createTable('usuario', (table)=>{
      table.bigIncrements('id').unsigned();
      table.string('nome').notNullable();
      table.string('cpf', 11).notNullable();
      table.string('telefone', 13).notNullable();
      table.unique('cpf');
      createdAt(knex, table);
      updatedAt(knex, table);
    });

    const usuario = await knex('usuario').insert({
      nome: "Dudu",
      cpf: "12345678912",
      telefone: "12300545" 
    });

     /** TABLE contato */
    await knex.schema.createTable('contato', (table)=>{
      table.bigIncrements('id').unsigned();
      table.string('nome').notNullable();
      table.string('cpf', 11).notNullable();
      table.string('telefone', 13).notNullable();
      table.integer('saldo').defaultTo(1000).notNullable();
      table.integer('limite').defaultTo(500).notNullable();
      table.enum('status', Object.keys(statusContato.default)).defaultTo(statusContato.default.ATIVADO).notNullable();
      table.unique(['cpf', 'status']);
      table
        .bigInteger('usuarioId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('usuario')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      createdAt(knex, table);
      updatedAt(knex, table);
    });

    /** TABLE conta */
    await knex.schema.createTable('conta', (table)=>{
      table.bigIncrements('id').unsigned();
      table.integer('saldo').defaultTo(1000).notNullable();
      table.integer('limite').defaultTo(500).notNullable();
      table
        .bigInteger('usuarioId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('usuario')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.unique('usuarioId');
      createdAt(knex, table);
      updatedAt(knex, table);
    });

    await knex('conta').insert({
      usuarioId: usuario
    });

    /** TABLE transferencia */
    await knex.schema.createTable('transferencia', (table)=>{
      table.bigIncrements('id').unsigned();
      table.integer('valor').notNullable();
      table.enum('status', Object.keys(statusTransferencia.default)).defaultTo(statusTransferencia.default.FINALIZADO).notNullable();
      table.string('descricao').nullable();
      table
        .bigInteger('contaId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('conta')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .bigInteger('contatoId')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('contato')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      createdAt(knex, table);
      updatedAt(knex, table);
    });
};

/**
 * @param {import('knex')} knex
*/
exports.down = async function(knex) {
  await knex.schema.dropTable('contato');
  await knex.schema.dropTable('transacoes');
  await knex.schema.dropTable('usuario');
};
