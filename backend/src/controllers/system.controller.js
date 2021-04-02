import { usuarioService } from '../services'
import { ApiError } from '../utils/erro';
import catchAsync from '../utils/catchAsync'
import { StatusCodes } from 'http-status-codes'
import knex from '../db';

const getUser = catchAsync(async (req, res) =>{
    const data = await usuarioService.findUsuarioConta()
    res.json(data)
})

const reload = catchAsync(async (req, res, next) =>{
    usuarioService.reloadUsuario({
        nome: "Dudu",
        cpf: "12345678912",
        telefone: "12300545" 
    }).then((result)=>{
        if(result.length){
            res.json("Reload realizado com sucesso")
        }else{
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Falha ao fazer reload do usuário');
        }
    }).catch(next)
})

const status = catchAsync(async (req, res, next) =>{
    knex.raw('select 1+1 as result').then(() =>{
        res.json("OK")
    }).catch(next);
})


export {
    reload,
    status,
    getUser
}