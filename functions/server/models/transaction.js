const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  type: {
    type: String,
    lowercase: true,
    required: true,
    enum: [
      "investment",
      "deposit",
      "withdrawal",
      "transfer",
      "income",
      "referral",
    ],
  },
  wallet: {
    type: String,
    uppercase: true,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // investment meta
  profit: {
    type: Number,
    required: function () {
      return this.type === "investment";
    },
  },
  extra: {
    type: Number,
    required: function () {
      return this.type === "investment";
    },
  },
  duration: {
    type: Number,
    required: function () {
      return this.type === "investment";
    },
  },
  autoIncrement: {
    type: Boolean,
    default: function () {
      return this.type === "investment" ? false : undefined;
    },
  },
  // transfer meta
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.type === "transfer";
    },
  },

  // income meta
  source: {
    type: Schema.Types.ObjectId,
    ref: "Transaction",
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // withdrawal meta
  method: {
    type: new Schema({
      type: String,
      address: Object
    }, {
      _id: false,
    }),
    required: function () {
      return this.type === "withdrawal"
    }
  },
  status: {
    type: String,
    default: "approved",
    enum: ["pending", "approved"]
  },
  mailApproved: {
    type: Boolean,
    default: false
  }
});

TransactionSchema.pre("save", function (next) {
  switch (this.type) {
    case "investment":
      if (Math.sign(this.amount) !== -1) {
        this.amount = this.amount * -1;
      }
      break;
    case "transfer":
      if (Math.sign(this.amount) !== -1) {
        this.amount = this.amount * -1;
      }
      break;
    case "withdrawal":
      if (Math.sign(this.amount) !== -1) {
        this.amount = this.amount * -1;
      }
      break;

    default:
      this.amount = Math.abs(this.amount);
      break;
  }
  next();
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
