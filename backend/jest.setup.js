import knex from 'knex'
import knexFile from './knexfile'
const conn = knex(knexFile.test)
import execute from './test/utils/sql'

beforeAll(async()=>{
    try {
        await execute('CREATE DATABASE IF NOT EXISTS test_ekki')
    } catch (error) {}
    await conn.migrate.up()
})

afterAll(async ()=>{
    try {
        await execute('DROP DATABASE test_ekki')
    } catch (error) {}
})