const cloudinary = require("../configs/cloudinary");

const { upload, destroy } = cloudinary.uploader;

// Upload

const uploadProfilePhoto = async (user, file) => {
  try {
    const resp = await upload(file, {
      upload_preset: "wiretradefx",
    });

    if (user.avatar && user.avatar.cloudId) {
      await destroy(user.avatar.cloudId);
    }

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
      upload_preset: "wiretradefx",
    });

    if (user.idFront && user.idFront.cloudId) {
      await destroy(user.idFront.cloudId);
    }

    user.idFront = {
      url: resp.secure_url,
      cloudId: resp.public_id,
      date: Date.now(),
    };

    await user.save();
  } catch (err) {
    throw err;
  }
};

const uploadIdBack = async (user, file) => {
  try {
    const resp = await upload(file, {
      upload_preset: "wiretradefx",
    });

    if (user.idBack && user.idBack.cloudId) {
      await destroy(user.idBack.cloudId);
    }

    user.idBack = {
      url: resp.secure_url,
      cloudId: resp.public_id,
      date: Date.now(),
    };

    await user.save();
  } catch (err) {
    throw err;
  }
};

const uploadDocumentSelfie = async (user, file) => {
  try {
    const resp = await upload(file, {
      upload_preset: "wiretradefx",
    });

    if (user.documentSelfie && user.documentSelfie.cloudId) {
      await destroy(user.documentSelfie.cloudId);
    }

    user.documentSelfie = {
      url: resp.secure_url,
      cloudId: resp.public_id,
      date: Date.now(),
    };
    user.isDocumentVerified = true;

    await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  uploadProfilePhoto,
  uploadIdFront,
  uploadIdBack,
  uploadDocumentSelfie,
};
