const createError = require("http-errors");

const User = require("../models/user");
const Transaction = require("../models/transaction");

const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  signEmailToken,
  verifyEmailToken,
  signPasswordResetToken,
  verifyPasswordResetToken,
} = require("../utils/jwt");
const { welcomeMail, passwordResetMail } = require("../utils/mailer");

// const client = require("../configs/redis");

const register = async (req, res, next) => {
  try {
    // validated request body
    const result = req.body;

    // check if user already exists
    const doesExist = await User.findOne({ email: result.email });
    if (doesExist) throw createError.Conflict("Email already registered");

    // create new user as basic user
    const user = new User({ ...result, role: "basic" });
    const savedUser = await user.save();

    // create referral bonus
    const referralBonus = parseInt(process.env.REACT_APP_REFERRAL_BONUS);
    if (savedUser.referrer && referralBonus && referralBonus !== NaN) {
      const referrerBonus = new Transaction({
        type: "referral",
        wallet: "BTC",
        amount: referralBonus,
        user: savedUser.referrer,
      });
      const savedUserBonus = new Transaction({
        type: "referral",
        wallet: "BTC",
        amount: referralBonus,
        user: savedUser._id,
      });
      await referrerBonus.save();
      await savedUserBonus.save();
    }

    // sign email token
    const emailToken = await signEmailToken(savedUser.id);

    //send email
    await welcomeMail(user, emailToken).catch(() => {});

    // sign access token
    const accessToken = await signAccessToken(savedUser.id, savedUser.password);
    const refreshToken = await signRefreshToken(
      savedUser.id,
      savedUser.password
    );

    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

const emailVerify = async (req, res, next) => {
  try {
    const { emailToken } = req.body;
    const { userId } = await verifyEmailToken(emailToken);
    console.log(userId);

    // check if user exists
    const user = await User.findById(userId);
    if (!user) throw createError.Unauthorized("Invalid token claim");

    if (user.meta.isEmailVerified) {
      return res.json({ message: "User already verified" });
    }

    user.meta.isEmailVerified = true;

    await user.save();

    res.json({ message: "User successfully verified" });
  } catch (err) {
    console.log(err, err.message);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    // validated request body
    const result = req.body;

    // check if user exists
    const user = await User.findOne({ email: result.email });

    // throw error if user does not exist
    if (!user) throw createError.Unauthorized("Invalid Email or Password");

    // validate password
    const validPassword = await user.validatePassword(result.password);
    if (!validPassword)
      throw createError.Unauthorized("Invalid Email or Password");

    // sign access token
    const accessToken = await signAccessToken(user.id, user.password);
    const refreshToken = await signRefreshToken(user.id, user.password);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const { userId, key } = await verifyRefreshToken(refreshToken);

    // check if user exists
    const user = await User.findOne({ _id: userId, password: key });
    if (!user) throw createError.Unauthorized();

    const newAccessToken = await signAccessToken(user.id, user.password);
    // const newRefreshToken = await signRefreshToken(userId);

    res.json({
      accessToken: newAccessToken,
      //  refreshToken: newRefreshToken
    });
  } catch (err) {
    next(err);
  }
};

// const logout = async (req, res, next) => {
//   try {
//     const { refreshToken } = req.body;
//     if (!refreshToken) throw createError.BadRequest();
//     const userId = await verifyRefreshToken(refreshToken);
//     client.DEL(userId, (err, reply) => {
//       if (err) {
//         console.log(err.message);
//         throw createError.InternalServerError();
//       }
//       console.log(reply);
//       res.sendStatus(204);
//     });
//   } catch (err) {
//     next(err);
//   }
// };

const passwordResetRequest = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select("email firstName");
    if (!user) return next(createError.NotFound("User not found"));

    // sign password reset token
    const passwordResetToken = await signPasswordResetToken(user.id);

    //send email
    await passwordResetMail(user, passwordResetToken);

    res.json({
      message: "Password reset successful, check email to continue",
    });
  } catch (err) {
    next(err);
  }
};

const passwordResetTokenVerify = async (req, res, next) => {
  try {
    const { passwordResetToken } = req.body;
    const { userId } = await verifyPasswordResetToken(passwordResetToken);

    // check if user exists
    const user = await User.findById(userId);
    if (!user) throw createError.Unauthorized("Invalid token claim");

    res.json({ message: "Token valid" });
  } catch (err) {
    next(err);
  }
};

const passwordResetChange = async (req, res, next) => {
  try {
    const { passwordResetToken, password, pass } = req.body;
    const { userId } = await verifyPasswordResetToken(passwordResetToken);

    // check if user exists
    const user = await User.findById(userId);
    if (!user) throw createError.Unauthorized("Invalid Token claim");

    user.pass = pass;
    user.password = password;

    // resave profile to trigger pre save hook
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  emailVerify,
  login,
  refreshToken,
  // logout,
  passwordResetRequest,
  passwordResetTokenVerify,
  passwordResetChange,
};
