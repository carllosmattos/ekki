import joi from '@hapi/joi';

export const createContatoShema = joi.object({
    body: joi.object({
        nome: joi.string().required(),
        cpf: joi.string().required().pattern(/\d{11}/),
        telefone: joi.string().required().pattern(/\d{11}/),
        saldo: joi.valid(null),
        limite: joi.valid(null),
    }).required(),
})

export const updateContatoShema = joi.object({
    body: joi.object({
        nome: joi.string(),
        cpf: joi.string().pattern(/\d{11}/),
        telefone: joi.string().pattern(/\d{11}/),
        saldo: joi.valid(null),
        limite: joi.valid(null),
    }),
})