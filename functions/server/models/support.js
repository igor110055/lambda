const mongoose = require("mongoose");

const SupportSchema = new mongoose.Schema({
  whatsapp: {
    type: String,
    required: false,
  },
});

const Support = mongoose.model("Support", SupportSchema);

module.exports = Support;
