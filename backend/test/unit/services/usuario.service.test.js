import { Chance } from 'chance'
import knex from '../../../src/db';
import { findUsuario, findUsuarioConta, reloadUsuario } from "../../../src/services/usuario.service";

const chance = new  Chance()
describe('Usuario Service', () => {
    beforeEach(async()=>{
        await Promise.all([
            knex('usuario').del()
        ])
    })

    describe('sucess', ()=>{
        it('findUsuario', async() => {
            await knex('usuario').insert({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13})
            })
            await expect(findUsuario()).resolves.toBeDefined()
        });
        
        it('findUsuarioConta', async() => {
            const [ id ] = await knex('usuario').insert({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13})
            })
            await knex('conta').insert({
                usuarioId: id
            })
            await expect(findUsuarioConta()).resolves.toBeDefined()
        });
        
        it('reloadUsuario', async() => {
            await knex('usuario').insert({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13})
            })
            await expect(reloadUsuario({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13})
            })).resolves.toBeDefined()
        });
    });
    
    describe('error', ()=>{
        it('findUsuario', async() => {
            await expect(findUsuario()).resolves.toEqual(undefined)
        });
        
        it('findUsuarioConta', async() => {
            await expect(findUsuarioConta()).resolves.toEqual(undefined)
        }); 
    });

});