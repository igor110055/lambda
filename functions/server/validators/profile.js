const Joi = require("joi");

const profileByEmailSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

const profilePasswordUpdateSchema = Joi.object({
  oldPassword: Joi.string().label("old password").required(),
  password: Joi.string().trim().min(8).required(),
  pass: Joi.string()
    .trim()
    .label("password confirmation")
    .valid(Joi.ref("password"))
    .required(),
});

const profileUpdateSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  profile: Joi.object({
    phone: Joi.string().required(),
    gender: Joi.string().required().valid("male", "female", "other"),
    dob: Joi.string().isoDate().required(),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

const profilePhotoSchema = Joi.object({
  profilePhoto: Joi.any().required(),
});

const documentSchema = Joi.object({
  document: Joi.any().required(),
});

module.exports = {
  profileByEmailSchema,
  profilePasswordUpdateSchema,
  profileUpdateSchema,
  profilePhotoSchema,
  documentSchema,
};
