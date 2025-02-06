import Joi, { ObjectSchema } from 'joi';

export const todoSchema: ObjectSchema = Joi.object({
    message: Joi.string().min(2).max(30).required()
});