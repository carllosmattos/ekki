import knex from '../db'
import transacting from '../utils/transacting'
import { subMinutes } from 'date-fns'
const TABLE_NAME = 'transferencia'

/**
 * @param {*} where 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
const findAllTransfer = async(where, trx)=>{
    const query = knex(TABLE_NAME)
    .options({ nestTables: true })
        .where(where)
        .innerJoin('contato','contato.id', 'transferencia.contatoId')
        .orderBy('transferencia.createdAt', 'desc')
    return transacting(query, trx);
}

/**
 * @param {*} where 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 const findTransferBy2M = async(where, trx)=>{
    const query = knex(TABLE_NAME)
        .where(where)
        .andWhere('createdAt', '>=', subMinutes(new Date(), 2))
    return transacting(query, trx);
}


/**
 * @param {*} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
const createTransfer = (data, trx)=>{
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
const updateTransfer = (where, data, trx)=>{
    const query = knex(TABLE_NAME)
        .where(where)
        .update(data)
        .forUpdate()
    return transacting(query, trx)
}

export {
    findAllTransfer,
    createTransfer,
    updateTransfer,
    findTransferBy2M
}