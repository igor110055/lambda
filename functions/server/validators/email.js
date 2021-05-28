const Joi = require("joi");

const emailSchema = Joi.object({
  from: Joi.string().lowercase(),
  email: Joi.string().email().lowercase().required(),
  title: Joi.string().required(),
  body: Joi.array().required(),
});

module.exports = {
  emailSchema,
};
