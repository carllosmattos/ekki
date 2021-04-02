import connection from "../db";
import contato from "../enums/contato";
import { findAllContact, createContact, updateContact } from "../model/contato.model";
import { getUser } from '../model/usuario.model'

/**
 * @param {*} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
const findContato = (where) =>{
    return findAllContact(where).andWhere({status: contato.ATIVADO})
}

/**
 * @param {*} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
const createContato = (data) =>{
    return connection.transaction(async(trx)=>{
        const user = await getUser(trx)
        data['usuarioId'] = user.id
        const [ find ] = await findAllContact({cpf: data.cpf, status: contato.DESATIVADO}, trx)
        if(find){
            await updateContact({id: find.id}, {...data, status: contato.ATIVADO}, trx)
            return [ find.id ]
        }
        return createContact(data)
    })
}

/**
 * @param {*} where 
 * @param {*} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
const updateContato = (where, data) =>{
    return updateContact(where, data)
}

/**
 * @param {*} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
const desactiveContato = (where) =>{
    return updateContact(where, {status: contato.DESATIVADO})
}

export {
    findContato,
    createContato,
    updateContato,
    desactiveContato
}