const router = require("express").Router();

// controllers
const ProfileController = require("../controllers/profile");

//middlewares
const auth = require("../middlewares/auth");
const matchId = require("../middlewares/matchId");
const validate = require("../middlewares/validate");

// validators
const { cardSchema } = require("../validators/card");
const { bankSchema } = require("../validators/bank");
const {
  profileByEmailSchema,
  profileUpdateSchema,
  profilePasswordUpdateSchema,
  profilePhotoSchema,
  documentSchema,
} = require("../validators/profile");

// friend profile
router.get("/:id", matchId, ProfileController.profileFriend);

// email profile
router.post(
  "/email",
  validate(profileByEmailSchema),
  ProfileController.profileByEmail
);

// apply auth middleware to require req user beyond this point
router.use(auth);

// user profile
router.get("/", ProfileController.profileUser);

// update profile
router.put("/", validate(profileUpdateSchema), ProfileController.profileUpdate);

// update profile
router.post(
  "/change-password",
  validate(profilePasswordUpdateSchema),
  ProfileController.profilePasswordUpdate
);

// add card
router.post("/card", validate(cardSchema), ProfileController.profileCardCreate);

// remove card
router.delete("/card/:id", ProfileController.profileCardRemove);

// add bank
router.post("/bank", validate(bankSchema), ProfileController.profileBankCreate);

// remove bank
router.delete("/bank/:id", ProfileController.profileBankRemove);

// request email verification
router.post(
  "/request-email-verification",
  ProfileController.profileRequestEmailVerification
);

// upload profile photo
router.post(
  "/avatar",
  validate(profilePhotoSchema),
  ProfileController.profilePhotoUpload
);

// reset profile photo
router.delete("/avatar", ProfileController.profilePhotoReset);

// upload id front
router.post(
  "/document/1",
  validate(documentSchema),
  ProfileController.idFrontUpload
);

// upload id back
router.post(
  "/document/2",
  validate(documentSchema),
  ProfileController.idBackUpload
);

// upload documentSelfie
router.post(
  "/document/3",
  validate(documentSchema),
  ProfileController.documentSelfieUpload
);
// upload document
router.post(
  "/document/upload",
  validate(documentSchema),
  ProfileController.documentUpload
);

module.exports = router;
