import { ApiError, ValidadeSchema } from "../utils/erro";
import { StatusCodes } from 'http-status-codes'

/* eslint-disable no-unused-vars*/
export default function errorHandler(err, req, res, next) {
    let error = err;
    switch (error.constructor) {
        case ApiError: {
            res.status(error.statusCode).json([{message: error.message}])
            break;
        }
        case ValidadeSchema: {
            let response = JSON.parse(error.message).map((i)=>{
                return {
                    name: i.context.key,
                    message: i.message
                }
            })
            res.status(error.statusCode).json(response)
            break;
        }
        default: {
            switch (error.code) {
                case "ER_DUP_ENTRY":
                    res.status(StatusCodes.BAD_REQUEST).json([{message: err.sqlMessage}])
                    break;
                case "ER_BAD_FIELD_ERROR":
                    res.status(StatusCodes.BAD_REQUEST).json([{message: err.sqlMessage}])
                    break;
                default:
                    /* eslint no-console: ["error", { allow: ["log"] }] */
                    console.log(err)
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json([{
                        message: `lamentamos isso ter ocorrido :(`
                    }])
                    break;
            }
            break;
        }
    }
}