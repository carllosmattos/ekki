import { Chance } from 'chance'
import knex from '../../../src/db';
import contatoStatus from '../../../src/enums/contato';
import { findContato, createContato, updateContato, desactiveContato } from "../../../src/services/contato.service";

const chance = new  Chance()
let usuarioId;
describe('Contato Service', () => {

    beforeEach(async()=>{
        await Promise.all([
            knex('contato').del(),
            knex('usuario').del()
        ])
        const [ id ] = await knex('usuario').insert({
            nome: chance.name(),
            cpf: chance.cpf({formatted: false}),
            telefone: chance.string({numeric: true, length: 13})
        })
        usuarioId = id
    })

    describe('sucess', ()=>{
        it('findContato', async() => {
            const contato = await knex('contato').insert({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13}),
                usuarioId
            })
            await expect(findContato({id: contato[0]})).resolves.toBeDefined()
        });
        
        it('createContato', async() => {
            const [ contatoId ] = await createContato({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13})
            })
            expect(contatoId).toBeDefined();
        });
        
        it('createContato - status desativado com o mesmo cpf', async() => {
            const cpf = chance.cpf({formatted: false})
            const [ contatoId ] = await knex('contato').insert({
                nome: chance.name(),
                cpf: cpf,
                status: contatoStatus.DESATIVADO,
                telefone: chance.string({numeric: true, length: 13}),
                usuarioId
            })
            const [ id ] = await createContato({
                nome: chance.name(),
                cpf: cpf,
                telefone: chance.string({numeric: true, length: 13})
            })
            expect(parseInt(id)).toBe(parseInt(contatoId));
        });
        
        it('updateContato', async() => {
            const [ contatoId ] = await knex('contato').insert({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                status: contatoStatus.DESATIVADO,
                telefone: chance.string({numeric: true, length: 13}),
                usuarioId
            })
            await expect(updateContato({id: contatoId}, {nome: chance.name()})).resolves.toBeDefined()
        });
        
        it('desactiveContato', async() => {
            const [ contatoId ] = await knex('contato').insert({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                status: contatoStatus.DESATIVADO,
                telefone: chance.string({numeric: true, length: 13}),
                usuarioId
            })
            await expect(desactiveContato({id: contatoId})).resolves.toBeDefined()
        });
    });
    
    describe('error', ()=>{
        
        it('createContato - sem os dados necessario', async() => {
            await expect(createContato({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
            })).rejects.toThrow();
        });
        
        it('updateContato - ID inexistente', async() => {
            await expect(updateContato({id: chance.integer()}, {nome: chance.name()})).resolves.toBe(0);
        });
        
        it('desactiveContato - ID inexistente', async() => {
            await expect(desactiveContato({id: chance.integer()})).resolves.toBe(0)
        });
        
    });

});