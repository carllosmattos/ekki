import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import app from '../../src/app'
import { Chance } from 'chance'
import knex from '../../src/db'
import transferenciaStatus from '../../src/enums/transferencia'

const chance = new  Chance()
let usuarioId;
let contaId;
describe('Transferencia Router', () => {
    
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
        it('list All', async() => {
            const contato = await knex('contato').insert({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13}),
                usuarioId
            })
            await knex('transferencia').insert({
                valor: 50,
                contatoId: contato[0],
                contaId
            })

            const res = await request(app)
            .get(`/transferencia`)
            .expect(StatusCodes.OK)
            expect(res.body[0]).toHaveProperty('valor')
            expect(res.body[0]).toHaveProperty('status')
            expect(res.body[0].status).toBe(transferenciaStatus.FINALIZADO)
        });
        
        it('Transfer', async() => {
            const contato = await knex('contato').insert({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13}),
                usuarioId
            })

            const res = await request(app)
            .post(`/transferencia`)
            .send({
                valor: 50,
                contato: contato[0]
            })
            .expect(StatusCodes.CREATED)
            expect(res.body).toBeDefined()
        });
        
        it('Transfer - dentro de periodo de 2M', async() => {
            const contato = await knex('contato').insert({
                nome: chance.name(),
                cpf: chance.cpf({formatted: false}),
                telefone: chance.string({numeric: true, length: 13}),
                usuarioId
            })
            await knex('transferencia').insert({
                valor: 50,
                contatoId: contato[0],
                contaId
            })

            const res = await request(app)
            .post(`/transferencia`)
            .send({
                valor: 50,
                contato: contato[0]
            })
            .expect(StatusCodes.CREATED)
            
            const res2 = await request(app)
            .get(`/transferencia`)
            .expect(StatusCodes.OK)
            expect(res2.body[1]).toHaveProperty('valor')
            expect(res2.body[1]).toHaveProperty('status')
            expect(res2.body[1].descricao).toBeDefined()
            expect(res2.body[1].status).toBe(transferenciaStatus.CANCELADO)
        });
    });
    
    describe('erro', ()=>{
        it('Transfer', async() => {
            const res = await request(app)
            .post(`/transferencia`)
            .send({
                valor: 50
            })
            .expect(StatusCodes.BAD_REQUEST)
            expect(res.body).toBeDefined()
        });
        
        it('create - contato inexitente', async() => {
            const res = await request(app)
            .post(`/transferencia`)
            .send({
                valor: 50,
                contato: 999
            })
            .expect(StatusCodes.NOT_FOUND)
            expect(res.body).toBeDefined()
        });  
    });
    
});