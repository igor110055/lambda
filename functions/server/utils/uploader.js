const cloudinary = require("../configs/cloudinary");

const { upload, destroy } = cloudinary.uploader;

// Destroy

const destroyProfilePhoto = async (user) => {
  try {
    if (user.avatar && user.avatar.cloudId) {
      await destroy(user.avatar.cloudId);

      user.avatar = null;
      await user.save();
    }
  } catch (err) {
    throw err;
  }
};

const destroyIdFront = async (user) => {
  try {
    if (user.idFront && user.idFront.cloudId) {
      await destroy(user.idFront.cloudId);

      user.idFront = null;
      await user.save();
    }
  } catch (err) {
    throw err;
  }
};

const destroyIdBack = async (user) => {
  try {
    if (user.idBack && user.idBack.cloudId) {
      await destroy(user.idBack.cloudId);

      user.idBack = null;
      await user.save();
    }
  } catch (err) {
    throw err;
  }
};

const destroyDocumentSelfie = async (user) => {
  try {
    if (user.documentSelfie && user.documentSelfie.cloudId) {
      await destroy(user.documentSelfie.cloudId);

      user.documentSelfie = null;
      await user.save();
    }
  } catch (err) {
    throw err;
  }
};

// Upload

const uploadProfilePhoto = async (user, file) => {
  try {
    const resp = await upload(file, {
      upload_preset: "bitbank",
    });

    if (user.avatar && user.avatar.cloudId) await destroyProfilePhoto(user);

    user.avatar = {
      url: resp.secure_url,
      cloudId: resp.public_id,
    };

    await user.save();
  } catch (err) {
    throw err;
  }
};

const uploadIdFront = async (user, file) => {
  try {
    const resp = await upload(file, {
      upload_preset: "bitbank",
    });

    if (user.idFront && user.idFront.cloudId) await destroyIdFront(user);

    user.idFront = {
      url: resp.secure_url,
      cloudId: resp.public_id,
    };

    await user.save();
  } catch (err) {
    throw err;
  }
};

const uploadIdBack = async (user, file) => {
  try {
    const resp = await upload(file, {
      upload_preset: "bitbank",
    });

    if (user.idBack && user.idBack.cloudId) await destroyIdBack(user);

    user.idBack = {
      url: resp.secure_url,
      cloudId: resp.public_id,
    };

    await user.save();
  } catch (err) {
    throw err;
  }
};

const uploadDocumentSelfie = async (user, file) => {
  try {
    const resp = await upload(file, {
      upload_preset: "bitbank",
    });

    if (user.documentSelfie && user.documentSelfie.cloudId)
      await destroyDocumentSelfie(user);

    user.documentSelfie = {
      url: resp.secure_url,
      cloudId: resp.public_id,
    };
    user.isDocumentVerified = true;

    await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  destroyProfilePhoto,
  uploadProfilePhoto,
  uploadIdFront,
  uploadIdBack,
  uploadDocumentSelfie,
};
