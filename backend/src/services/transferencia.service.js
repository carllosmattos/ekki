import knex from '../db'
import transferencia from "../enums/transferencia";
import { findAllTransfer, findTransferBy2M, updateTransfer, createTransfer } from '../model/transferencia.model'
import { getUserAndAccount, updateAccount } from '../model/usuario.model'
import { findAllContact, updateContact } from '../model/contato.model'
import { ApiError } from '../utils/erro';
import { StatusCodes } from 'http-status-codes'

/**
 * @param {*} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 const findTransfer = (where) =>{
    return findAllTransfer(where)
}
/**
 * @param {*} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
const createNewTransfer = (data) =>{
    return knex.transaction(async(trx)=>{
        const [ contato ] = await findAllContact({id: data.contato}, trx)
        const usuario = await getUserAndAccount(trx)

        if(!contato){
            throw new ApiError(StatusCodes.NOT_FOUND, 'Contato não encontrado')
        }
        
        if(!usuario){
            throw new ApiError(StatusCodes.NOT_FOUND, 'Usuario não encontrado')
        }

        const { conta } = usuario 
        let usuarioSaldo = conta.saldo
        let usuarioSaldoLimite = conta.limite
    
        const oldTransfer = await findTransferBy2M({
            status: transferencia.FINALIZADO, 
            valor: data.valor,
            contatoId: data.contato, 
            contaId: conta.id
        }, trx)

        oldTransfer.forEach(async(cancelar)=>{
            await updateTransfer({
                id: cancelar.id
            }, 
            {
                status: transferencia.CANCELADO, 
                descricao: "Mais de uma transferenca realizada dentro do periodo de 2m"
            }, trx)
        })

        // Atualizando valores da conta do usuário
        if(oldTransfer.length === 0){
            // Verificar se usuario tem saldo necessario para a tranferencia
            if(data.valor > parseInt(usuarioSaldo + usuarioSaldoLimite)){
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Você não possui saldo suficiente para realizar essa transferencia!!')
            }

            // Depreciando valores
            if(data.valor < parseInt(usuarioSaldo)){
                // Depreciar do saldo do usuário
                usuarioSaldo = usuarioSaldo - data.valor
            }else{
                // Depreciar do saldo limite do usuário
                const valor = data.valor - usuarioSaldo
                usuarioSaldo = 0
                usuarioSaldoLimite = usuarioSaldoLimite - valor
            }
            await updateAccount({id: conta.id}, {saldo: usuarioSaldo, limite: usuarioSaldoLimite}, trx)
            await updateContact({id: contato.id}, {saldo: parseInt(contato.saldo + data.valor)}, trx)
            /* eslint no-console: ["error", { allow: ["log"] }] */
            console.log(`Saldo :${usuarioSaldo} \n Saldo Limite: ${usuarioSaldoLimite}`)
        }
        return createTransfer({
            valor: data.valor,
            contatoId: data.contato,
            contaId: conta.id,
        }, trx)
    })
}


export {
    findTransfer,
    createNewTransfer
}