import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import hidePoweredBy from 'hide-powered-by'
import hsts from 'hsts'
import xssFilter from 'x-xss-protection'
import swagger from 'swagger-ui-express'
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./doc/swagger.yml')
import contatoRouter from './routes/contatos.routes'
import systemRouter from './routes/system.routes'
import transferenciaRouter from './routes/transferencia.routes'

/** Instances */
dotenv.config()
const app = express();

/** Middlewares */
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(helmet())
app.use(hsts({
    maxAge: 31536000,
    includeSubDomains: true, 
    preload: true
}))
app.use(xssFilter())
app.use(hidePoweredBy())


/** Routers */
app.get('/', (req, res)=>{
    res.json("API ON")
})
app.use('/api-doc', swagger.serve, swagger.setup(swaggerDocument))
app.use('/contato', contatoRouter)
app.use('/system', systemRouter)
app.use('/transferencia', transferenciaRouter)

export default app