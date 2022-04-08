const Joi = require("joi");

const transactionSchema = Joi.object({
  type: Joi.string()
    .lowercase()
    .required()
    .valid("investment", "deposit", "withdrawal", "transfer", "income"),
  wallet: Joi.string().uppercase().required(),
  amount: Joi.number().required(),
  description: Joi.when("type", {
    is: "income",
    then: Joi.string().required(),
    otherwise: Joi.string(),
  }),
  date: Joi.string().isoDate(),
  user: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/, {
      name: "user id",
    })
    .required(),

  // investment meta
  profit: Joi.when("type", {
    is: "investment",
    then: Joi.number().default(0),
    otherwise: Joi.forbidden(),
  }),
  duration: Joi.when("type", {
    is: "investment",
    then: Joi.number().min(1).required(),
    otherwise: Joi.forbidden(),
  }),
  autoIncrement: Joi.when("type", {
    is: "investment",
    then: Joi.boolean().default(false),
    otherwise: Joi.forbidden(),
  }),

  // transfer meta
  receiver: Joi.when("type", {
    is: "transfer",
    then: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/, {
        name: "receiver id",
      })
      .required(),
    otherwise: Joi.forbidden(),
  }),

  // withdrawal meta
  method: Joi.when("type", {
    is: "withdrawal",
    then: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/, {
        name: "method id",
      })
      .required(),
    otherwise: Joi.forbidden(),
  }),
  completed: Joi.boolean(),
});

const transactionUpdateSchema = Joi.object({
  wallet: Joi.string().uppercase(),
  amount: Joi.number(),
  description: Joi.string(),
  date: Joi.string().isoDate(),

  // investment meta
  profit: Joi.number(),
  duration: Joi.number().min(1),
  autoIncrement: Joi.boolean(),

  // withdrawal meta
  completed: Joi.boolean(),
});

const transactionTradeSchema = Joi.object({
  type: Joi.string()
    .lowercase()
    .required()
    .valid("buy", "sell"),
  wallet: Joi.string().uppercase().required(),
  walletName: Joi.string().required(),
  crypto_wallet: Joi.string().uppercase().required(),
  amount: Joi.number().positive().required(),
  charges: Joi.number().positive().required(),
  date: Joi.string().isoDate(),
  user: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/, {
      name: "user id",
    })
    .required(),
});

module.exports = {
  transactionSchema,
  transactionUpdateSchema,
  transactionTradeSchema
};
