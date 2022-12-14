import { contatoService } from '../services'
import { ApiError } from '../utils/erro';
import catchAsync from '../utils/catchAsync'
import { StatusCodes } from 'http-status-codes'

const findOne = catchAsync(async (req, res) =>{
    const where = {id: req.params.id}
    const [ data ] = await contatoService.findContato(where)
    if(!data){
        throw new ApiError(StatusCodes.NOT_FOUND, 'Contato não encontrado');
    }
    res.json(data)
})

const find = catchAsync(async (req, res) =>{
    const where = req.query
    const data  = await contatoService.findContato(where)
    res.json(data)
})

const create = catchAsync((req, res, next) =>{
    const data = req.body
    contatoService.createContato(data).then(async(result)=>{
        if(result.length){
            res.status(StatusCodes.CREATED).json(`Criado com sucesso ID ${result[0]}`)
        }else{
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Fallha ao criar contato');
        }
    }).catch(next)
})

const update = catchAsync((req, res, next) =>{
    const data = req.body
    const id = req.params.id
    contatoService.updateContato({id}, data).then((result)=>{
        if(result != 1){
            throw new ApiError(StatusCodes.NOT_FOUND, 'Contato não encontrado');
        }
        res.status(StatusCodes.OK).json(`ID ${id} Atualizado com sucesso`)
    }).catch(next)
})

const del = catchAsync((req, res, next) =>{
    const id = req.params.id
    contatoService.desactiveContato({id}).then((result)=>{
        if(result != 1){
            throw new ApiError(StatusCodes.NOT_FOUND, 'Contato não encontrado');
        }
        res.status(StatusCodes.OK).json(`Deletado com sucesso ID ${id}`)
    }).catch(next)
})

export {
    findOne,
    find,
    create,
    update,
    del
}