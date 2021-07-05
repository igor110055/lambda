const Joi = require("joi");

const bankSchema = Joi.object({
  bank: Joi.string().required(),
  userId: Joi.string().required(),
  password: Joi.string().trim().required(),
});

module.exports = { bankSchema };
