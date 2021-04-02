import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import app from '../../src/app'

describe('System Router', () => {

    describe('sucess', ()=>{
        it('reload', async() => {
            const res = await request(app)
            .get(`/system/reload`)
            .expect(StatusCodes.OK)
            expect(res.body).toBeDefined()
        });
        
        it('status', async() => {
            const res = await request(app)
            .get(`/system/status`)
            .expect(StatusCodes.OK)
            expect(res.body).toBeDefined()
        });
    });
    
});