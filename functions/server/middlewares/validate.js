const validate = (schema) => async (req, res, next) => {
  try {
    // validate request body
    const validatedBody = await schema.validateAsync(req.body);
    
    // modify request body
    req.body = validatedBody;
    next();
  } catch (err) {
    if (err.isJoi) err.status = 422;
    next(err);
  }
};

module.exports = validate;
