import joi from 'joi';

const schemaBattle = joi.object({
    firstUser: joi.string().required(),
    secondUser: joi.string().required()
})

export default schemaBattle;
