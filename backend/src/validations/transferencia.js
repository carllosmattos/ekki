import joi from '@hapi/joi';

export const transferShema = joi.object({
    body: joi.object({
        valor: joi.number().required(),
        contato: joi.number().required(),
    }).required(),
})
