import joi from 'joi';

const schemaBattle: joi.ObjectSchema = joi.object({
    firstUser: joi.string().required(),
    secondUser: joi.string().required()
})

export default schemaBattle;
