import knex from '../db'
import transacting from '../utils/transacting'
const TABLE_NAME = 'usuario'

/**
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {*}
 */
const getUser = async(trx)=>{
    const query = knex(TABLE_NAME)
        .first()
    return transacting(query, trx);
}

/**
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {*}
 */
const getUserAndAccount = async(trx)=>{
    const query = knex(TABLE_NAME)
        .options({ nestTables: true })
        .first()
        .innerJoin('conta','conta.usuarioId', 'usuario.id')
    return transacting(query, trx);
}

/**
 * @param {*} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
const createUser = async(data, trx)=>{
    const [ user ] = await knex(TABLE_NAME)
        .transacting(trx)
        .insert(data)
    return knex('conta')
        .transacting(trx)
        .insert({usuarioId: user})
}

/**
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {*}
 */
const deleteUser = async(trx)=>{
    const user = await knex(TABLE_NAME)
        .transacting(trx)
        .first()

    return knex(TABLE_NAME)
        .transacting(trx)    
        .where('id', user.id)
        .del()
}


/**
 * @param {*} where 
 * @param {*} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 const updateAccount = (where, data, trx)=>{
    const query = knex('conta')
        .where(where)
        .update(data)
        .forUpdate()
    return transacting(query, trx)
}

export {
    getUser,
    getUserAndAccount,
    createUser,
    deleteUser,
    updateAccount
}