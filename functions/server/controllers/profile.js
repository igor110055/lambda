const createError = require("http-errors");

const User = require("../models/user");

const { signEmailToken } = require("../utils/jwt");
const { emailVerificationMail } = require("../utils/mailer");

const {
  destroyProfilePhoto,
  uploadProfilePhoto,
  uploadIdFront,
  uploadIdBack,
  uploadDocumentSelfie,
  uploadDocument,
} = require("../utils/uploader");

const profileUser = async (req, res, next) => {
  try {
    const id = req.user.id;

    const user = await User.findById(id);
    if (!user) return next(createError.NotFound("User not found"));

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const profileFriend = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id).select(
      "email firstName lastName avatar"
    );
    if (!user) return next(createError.NotFound("User not found"));

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const profileByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select(
      "email firstName lastName avatar"
    );
    if (!user) return next(createError.NotFound("User not found"));

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const profileUpdate = async (req, res, next) => {
  try {
    // validated request body
    const result = req.body;

    const userId = req.user.id;

    // update profile
    const updatedProfile = await User.findByIdAndUpdate(userId, result, {
      new: true,
    });
    if (!updatedProfile) return next(createError.NotFound("User not found"));

    // resave profile to trigger pre save hook
    const savedProfile = await updatedProfile.save();

    res.json(savedProfile);
  } catch (err) {
    next(err);
  }
};

const profilePasswordUpdate = async (req, res, next) => {
  try {
    // validated request body
    const result = req.body;

    const userId = req.user.id;

    // validate password
    const user = await User.findById(userId);
    const validPassword = await user.validatePassword(result.oldPassword);
    if (!validPassword) throw createError.Forbidden("Incorrect Password");

    user.pass = result.pass;
    user.password = result.password;

    // resave profile to trigger pre save hook
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};

const profileCardCreate = async (req, res, next) => {
  try {
    // validated request body
    const result = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return next(createError.NotFound("User not found"));

    // create new card
    user.cards.unshift(result);
    await user.save();

    const card = user.cards[0];

    res.json(card);
  } catch (err) {
    next(err);
  }
};

const profileCardRemove = async (req, res, next) => {
  try {
    const id = req.params.id;

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return next(createError.NotFound("User not found"));

    const deletedCard = user.cards.find((card) => card.id === id);
    if (!deletedCard) return next(createError.NotFound("User Card not found"));

    const updatedCards = user.cards.map((card) => {
      if (card.id === id) {
        card.removed = true;
      }
      return card;
    });
    user.cards = updatedCards;
    await user.save();

    res.json({ message: "User Card successfully deleted" });
  } catch (err) {
    next(err);
  }
};

const profileBankCreate = async (req, res, next) => {
  try {
    // validated request body
    const result = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return next(createError.NotFound("User not found"));

    // create new card
    user.banks.unshift(result);
    await user.save();

    const bank = user.banks[0];

    res.json(bank);
  } catch (err) {
    next(err);
  }
};

const profileBankRemove = async (req, res, next) => {
  try {
    const id = req.params.id;

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return next(createError.NotFound("User not found"));

    const deletedBank = user.banks.find((bank) => bank.id === id);
    if (!deletedBank) return next(createError.NotFound("User Bank not found"));

    const updatedBanks = user.banks.map((bank) => {
      if (bank.id === id) {
        bank.removed = true;
      }
      return bank;
    });
    user.banks = updatedBanks;
    await user.save();

    res.json({ message: "User Bank successfully deleted" });
  } catch (err) {
    next(err);
  }
};

const profileRequestEmailVerification = async (req, res, next) => {
  try {
    const id = req.user.id;
    const email = req.user.email;

    // sign email token
    const emailToken = await signEmailToken(id);

    //send email
    await emailVerificationMail(email, emailToken);

    res.json({
      message: "Please check email to complete verification",
    });
  } catch (err) {
    next(err);
  }
};

const profilePhotoReset = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return next(createError.NotFound("User not found"));

    // cloudinary destroy
    await destroyProfilePhoto(user);

    res.json({
      message: "Profile photo reset successful",
    });
  } catch (err) {
    next(err);
  }
};

const profilePhotoUpload = async (req, res, next) => {
  try {
    // validated request body
    const { profilePhoto } = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return next(createError.NotFound("User not found"));

    // cloudinary upload
    await uploadProfilePhoto(user, profilePhoto);

    res.json({
      message: "Profile photo uploaded successfully",
    });
  } catch (err) {
    next(err);
  }
};

const idFrontUpload = async (req, res, next) => {
  try {
    // validated request body
    const { document } = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return next(createError.NotFound("User not found"));

    // cloudinary upload
    await uploadIdFront(user, document);

    res.json({
      message: "ID front uploaded successfully",
    });
  } catch (err) {
    next(err);
  }
};

const idBackUpload = async (req, res, next) => {
  try {
    // validated request body
    const { document } = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return next(createError.NotFound("User not found"));

    // cloudinary upload
    await uploadIdBack(user, document);

    res.json({
      message: "ID back uploaded successfully",
    });
  } catch (err) {
    next(err);
  }
};

const documentSelfieUpload = async (req, res, next) => {
  try {
    // validated request body
    const { document } = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return next(createError.NotFound("User not found"));

    // cloudinary upload
    await uploadDocumentSelfie(user, document);

    res.json({
      message: "Document Selfie uploaded successfully",
    });
  } catch (err) {
    next(err);
  }
};

const documentUpload = async (req, res, next) => {
  try {
    // validated request body
    const { document } = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return next(createError.NotFound("User not found"));

    //  cloudinary upload
    const result = await uploadDocument(document);

    // create new document
    const documentName = user.requestedDocument || "Unnamed Document";
    user.documents.unshift({ ...result, name: documentName });
    user.isDocumentRequested = false;
    user.requestedDocument = null;
    user.requestedDocumentDescription = null;
    await user.save();

    const savedDocument = user.documents[0];

    res.json(savedDocument);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  profileUser,
  profileFriend,
  profileByEmail,
  profileUpdate,
  profilePasswordUpdate,
  profileCardCreate,
  profileCardRemove,
  profileBankCreate,
  profileBankRemove,
  profileRequestEmailVerification,
  profilePhotoReset,
  profilePhotoUpload,
  idFrontUpload,
  idBackUpload,
  documentSelfieUpload,
  documentUpload,
};
