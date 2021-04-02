import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import app from '../../src/app'
import { Chance } from 'chance'
import knex from '../../src/db'
import contatoStatus from '../../src/enums/contato'

const chance = new  Chance()
let usuarioId;
describe('Contato Router', () => {
    
    beforeEach(async()=>{
        await Promise.all([
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
        it('findOne', async() => {
            const contato = await knex('contato').insert({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13}),
                usuarioId
            })

            const res = await request(app)
            .get(`/contato/${contato[0]}`)
            .expect(StatusCodes.OK)
            expect(res.body).toHaveProperty('cpf')
            expect(res.body).toHaveProperty('nome')
            expect(res.body).toHaveProperty('telefone')
        });
        
        it('find', async() => {
            await knex('contato').insert({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13}),
                usuarioId
            })

            const res = await request(app)
            .get(`/contato`)
            .expect(StatusCodes.OK)
            expect(res.body[0]).toHaveProperty('cpf')
            expect(res.body[0]).toHaveProperty('nome')
            expect(res.body[0]).toHaveProperty('telefone')
        });
        
        it('create', async() => {
            const res = await request(app)
            .post(`/contato`)
            .send({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13})
            })
            .expect(StatusCodes.CREATED)
            expect(res.body).toBeDefined()
        });
        
        it('create - contato desativado', async() => {
            const cpf = chance.cpf({formatted: false})
            const [ id ] = await knex('contato').insert({
                nome: chance.name(),
                cpf,
                telefone: chance.string({numeric: true, length: 13}),
                status: contatoStatus.DESATIVADO,
                usuarioId
            })

            const res = await request(app)
            .post(`/contato`)
            .send({
                nome: chance.name(),
                cpf,
                telefone: chance.string({numeric: true, length: 13})
            })
            .expect(StatusCodes.CREATED)
            expect(res.body).toBe(`Criado com sucesso ID ${id}`)
        });
       
        it('update', async() => {
            const [ id ] = await knex('contato').insert({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13}),
                usuarioId
            })
            const res = await request(app)
            .put(`/contato/${id}`)
            .send({
                nome: chance.name(),
            })
            .expect(StatusCodes.OK)
            expect(res.body).toBeDefined()
        });
        
        it('delete', async() => {
            const [ id ] = await knex('contato').insert({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13}),
                usuarioId
            })
            const res = await request(app)
            .put(`/contato/${id}`)
            .send({
                nome: chance.name(),
            })
            .expect(StatusCodes.OK)
            expect(res.body).toBeDefined()
        });
    });
    
    describe('erro', ()=>{
        it('findOne', async() => {
            await request(app)
            .get(`/contato/${chance.integer()}`)
            .expect(StatusCodes.NOT_FOUND)
        });
        
        it('create', async() => {
            const res = await request(app)
            .post(`/contato`)
            .send({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
            })
            .expect(StatusCodes.BAD_REQUEST)
            expect(res.body).toBeDefined()
        });
        
        it('create - contato desativado', async() => {
            const cpf = chance.cpf({formatted: false})
            await knex('contato').insert({
                nome: chance.name(),
                cpf,
                telefone: chance.string({numeric: true, length: 13}),
                status: contatoStatus.DESATIVADO,
                usuarioId
            })

            const res = await request(app)
            .post(`/contato`)
            .send({
                nome: chance.name(),
                cpf
            })
            .expect(StatusCodes.BAD_REQUEST)
            expect(res.body).toBeDefined()
        });
       
        it('update', async() => {
            await request(app)
            .put(`/contato/${chance.integer()}`)
            .send({
                nome: chance.name(),
            })
            .expect(StatusCodes.NOT_FOUND)
        });
        
        it('delete', async() => {
            await request(app)
            .put(`/contato/${chance.integer()}`)
            .send({
                nome: chance.name(),
            })
            .expect(StatusCodes.NOT_FOUND)
        });
    });
    
});