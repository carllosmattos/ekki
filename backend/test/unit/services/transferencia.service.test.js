import { Chance } from 'chance'
import knex from '../../../src/db';
import { createNewTransfer, findTransfer } from "../../../src/services/transferencia.service";

const chance = new  Chance()
let usuarioId;
let contaId;
describe('Transferencia Service', () => {

    beforeEach(async()=>{
        await Promise.all([
            knex('usuario').del()
        ])
        
        const [ id ] = await knex('usuario').insert({
            nome: chance.name(),
            cpf: chance.cpf({formatted: false}),
            telefone: chance.string({numeric: true, length: 13})
        })
        const [ conta ] = await knex('conta').insert({
            usuarioId: id
        })
        contaId = conta
        usuarioId = id
    })

    describe('sucess', ()=>{
        it('findTransfer', async() => {
            const contato = await knex('contato').insert({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13}),
                usuarioId
            })
            const transferencia = await knex('transferencia').insert({
                valor: 50,
                contatoId: contato[0],
                contaId
            })
            await expect(findTransfer({id: transferencia[0]})).resolves.toBeDefined()
        });
        
        it('createNewTransfer', async() => {
            const contato = await knex('contato').insert({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13}),
                usuarioId
            })

            const [ contattransferenciaId ] = await createNewTransfer({
                valor: 50,
                contato: contato[0]
            })
            expect(contattransferenciaId).toBeDefined();
        });
    });
    
    describe('error', ()=>{
        it('createNewTransfer - sem os dados necessario', async() => {
            await expect(createNewTransfer()).rejects.toThrow();
        });
    });

});