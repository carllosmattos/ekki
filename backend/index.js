import app from './src/app'
import errorHandler from './src/middleware/errorHandler'
import env from './src/env'

export function startup(){
    return app.listen(env.server.port, ()=>{
        app.use(errorHandler)
        console.log(`http://localhost:${env.server.port}`)
    })
}

startup();