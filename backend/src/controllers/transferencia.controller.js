import { transacoesService } from '../services'
import { ApiError } from '../utils/erro';
import catchAsync from '../utils/catchAsync'
import { StatusCodes } from 'http-status-codes'

const listTranfer = catchAsync(async (req, res) =>{
    const where = req.query
    const data = await transacoesService.findTransfer(where)
    res.json(data)
})

const transfer = catchAsync(async (req, res, next) =>{
    const data = req.body
    transacoesService.createNewTransfer(data).then(async(result)=>{
        if(result.length){
            res.status(StatusCodes.CREATED).json(`Transferencia realizada com sucesso ID ${result[0]}`)
        }else{
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Fallha ao tentar realizar a transferencia');
        }
    }).catch(next)
})


export {
    listTranfer,
    transfer,
}