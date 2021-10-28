import Joi from 'joi';

export const productSkuSchema = Joi.object()
  .keys({
    productSku: Joi.string()
      .guid({
        version: ['uuidv4'],
      })
      .required(),
  })
  .required();
