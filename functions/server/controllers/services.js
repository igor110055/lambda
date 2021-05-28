const User = require("../models/user");
const Transaction = require("../models/transaction");
const Wallet = require("../models/wallet");

const { customMailer, inboundMailer } = require("../utils/mailer");

const statistics = async (req, res, next) => {
  try {
    const users = await User.estimatedDocumentCount();
    const transactions = await Transaction.estimatedDocumentCount();
    const wallets = await Wallet.estimatedDocumentCount();

    res.json({ count: { users, transactions, wallets } });
  } catch (err) {
    next(err);
  }
};

const sendMail = async (req, res, next) => {
  try {
    // validated request body
    const result = req.body;

    await customMailer(result);

    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.log(err, err.message);
    next(err);
  }
};

const inboundMail = async (req, res, next) => {
  try {
    const from = req.body.from;
    const subject = req.body.subject;
    const text = req.body.text;
    const html = req.body.html;

    await inboundMailer({ from, subject, text, html });

    // edit
    res.json({ message: "Email received successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { statistics, sendMail, inboundMail };
