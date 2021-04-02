import knex from '../db'
import { getUser, getUserAndAccount, createUser, deleteUser } from '../model/usuario.model'

/**
 * @returns {import('knex').Knex.QueryBuilder}
 */
const findUsuario = () =>{
    return getUser()
}

/**
 * @returns {import('knex').Knex.QueryBuilder}
 */
const findUsuarioConta = () =>{
    return getUserAndAccount()
}

/**
 * @param {*} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
const reloadUsuario = (data) =>{
    return knex.transaction(async(trx)=>{
        await deleteUser(trx)
        return createUser(data, trx)
    })
}

export {
    findUsuario,
    findUsuarioConta,
    reloadUsuario
}