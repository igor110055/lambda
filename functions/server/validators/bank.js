const Joi = require("joi");

const bankSchema = Joi.object({
  bank: Joi.string().required(),
  accountName: Joi.string().required(),
  accountNumber: Joi.string().required(),
});

module.exports = { bankSchema };
