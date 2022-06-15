const JWT = require("jsonwebtoken");
const createError = require("http-errors");

const User = require("../models/user");

const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // return if no Authorization header
  if (!authHeader) return next(createError.Unauthorized());

  // return if header not Bearer
  if (!authHeader.startsWith("Bearer")) return next(createError.Unauthorized());

  // split header and get token part
  const token = authHeader.split(" ")[1];

  // verify access token and set req userid or return
  JWT.verify(token, process.env.ACCESS_SECRET, async (err, payload) => {
    if (err) {
      // return jwt error message only if token might be expired. ie return null if jwt is invalid
      const message = err.name === "JsonWebTokenError" ? null : err.message;
      return next(createError.Unauthorized(message));
    }
    // find user and save in request object
    try {
      const user = await User.findOne({
        _id: payload.aud,
        password: payload.key,
      });

      if (!user) throw createError.Unauthorized();
      req.user = user;

      next();
    } catch (err) {
      next(createError.Unauthorized());
    }
  });
};

module.exports = verifyAccessToken;
