const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  password: Joi.string().min(8).required().trim(),
  pass: Joi.string()
    .trim()
    .label("password confirmation")
    .valid(Joi.ref("password"))
    .required(),
  role: Joi.string().valid("basic", "moderator", "admin"),
});

const userUpdateSchema = Joi.object({
  role: Joi.string().valid("basic", "moderator", "admin"),
  plan: Joi.string().valid("level 1", "level 2", "level 3"),
  meta: Joi.object({
    requireUpgrade: Joi.boolean(),
    isActive: Joi.boolean(),
    isRestricted: Joi.boolean(),
    isEmailVerified: Joi.boolean(),
  }),
  isDocumentVerified: Joi.boolean(),
  referralBonus: Joi.number()
});

const userWalletSchema = Joi.object({
  symbol: Joi.string().uppercase().required(),
  address: Joi.string().required(),
});

const userDocumentRequestSchema = Joi.object({
  documentName: Joi.string().required(),
  description: Joi.string(),
});

module.exports = {
  userSchema,
  userUpdateSchema,
  userWalletSchema,
  userDocumentRequestSchema,
};
