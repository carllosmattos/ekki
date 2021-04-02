import knex from '../db'
import transacting from '../utils/transacting'
const TABLE_NAME = 'contato'

/**
 * @param {*} where 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
const findAllContact = (where, trx)=>{
    const query = knex(TABLE_NAME)
        .where(where)
        .select([
            'id',
            'nome',
            'cpf',
            'telefone',
            'saldo',
            'limite',
            'createdAt',
            'updatedAt'
        ])
    return transacting(query, trx)
}

/**
 * @param {*} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
const createContact = (data, trx)=>{
    const query = knex(TABLE_NAME)
        .insert(data)
    return transacting(query, trx)
}

/**
 * @param {*} where 
 * @param {*} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
const updateContact = (where, data, trx)=>{
    const query = knex(TABLE_NAME)
        .where(where)
        .update(data)
        .forUpdate()
    return transacting(query, trx)
}

export {
    findAllContact,
    createContact,
    updateContact
}