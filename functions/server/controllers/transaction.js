const createError = require("http-errors");

const Transaction = require("../models/transaction");
const User = require("../models/user");

const { withdrawalMail } = require("../utils/mailer");
const {
  cascade,
  concurrency,
  transferactivity,
} = require("../utils/transactivity");

const transactionList = (req, res, next) => {
  try {
    // add query result to response
    res.query = Transaction.find()
      .limit(20)
      .sort("-date")
      .populate("user", "email firstName lastName");
    next();
  } catch (err) {
    next(err);
  }
};

const transactionUserList = (req, res, next) => {
  try {
    const user = req.params.userId;
    // add query result to response
    res.query = Transaction.find({ user })
      .sort("-date")
      .populate("user", "email firstName lastName");
    next();
  } catch (err) {
    next(err);
  }
};

const transactionReqUserList = (req, res, next) => {
  try {
    const user = req.user.id;
    // add query result to response
    res.query = Transaction.find({ user }).sort("-date");
    next();
  } catch (err) {
    next(err);
  }
};

const transactionDetail = async (req, res, next) => {
  try {
    const id = req.params.id;

    const transaction = await Transaction.findById(id).populate(
      "user",
      "email firstName lastName"
    );
    if (!transaction) throw createError.NotFound("Transaction not found");

    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

const transactionReqUserDetail = async (req, res, next) => {
  try {
    const user = req.user.id;
    const _id = req.params.id;

    const transaction = await Transaction.findOne({ _id, user });
    if (!transaction) throw createError.NotFound("Transaction not found");

    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

const transactionCreate = async (req, res, next) => {
  try {
    // validated request body
    let result = req.body;

    if (req.user.meta.isRestricted)
      throw createError.Forbidden("Account Restricted");

    if (req.user.role !== "admin") {
      result = { ...result, user: req.user.id };
      if (result.type === "investment") {
        result = { ...result, profit: 0 };
      }
      const allowedTransactions = ["investment", "transfer", "withdrawal"];
      if (!allowedTransactions.includes(result.type)) {
        throw createError.Forbidden("You do not have sufficient permission");
      }
      if (result.type === "withdrawal" && !req.user.idFront.url) {
        await User.findByIdAndUpdate(req.user.id, {
          isDocumentVerified: false
        });
        throw createError.Forbidden("Please verify ID Documents")
      }
    }

    // create new transaction
    const transaction = new Transaction(result);
    const savedTransaction = await transaction.save();

    // send withdrawal mail
    if (result.type === "withdrawal") {
      await withdrawalMail(req.user, savedTransaction);
    }

    // create transfer
    await transferactivity(savedTransaction);

    res.json(savedTransaction);
  } catch (err) {
    next(err);
  }
};

const transactionUpdate = async (req, res, next) => {
  try {
    const id = req.params.id;

    // validated request body
    const result = req.body;

    // update transaction
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, result, {
      new: true,
    });
    if (!updatedTransaction)
      throw createError.NotFound("Transaction not found");

    // resave transaction to trigger pre save hook
    const savedTransaction = await updatedTransaction.save();

    // update transaction and side effect
    await concurrency(savedTransaction);

    res.json(savedTransaction);
  } catch (err) {
    next(err);
  }
};

// delete
const transactionDelete = async (req, res, next) => {
  try {
    const id = req.params.id;

    // delete transaction
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (!deletedTransaction)
      throw createError.NotFound("Transaction not found");

    // delete transaction side effects
    await cascade(deletedTransaction);

    res.json({ message: "Transaction successfully deleted" });
  } catch (err) {
    next(err);
  }
};

// dummy route
const transactionTotal = async (req, res, next) => {
  try {
    const user = req.user.id;
    const transactions = await Transaction.find({ user });
    const mapTotal = transactions.reduce((total, tx) => {
      if (tx.type === "investment") {
        return total + tx.amount + tx.profit;
      } else {
        return total + tx.amount;
      }
    }, 0);
    const aggregate = await Transaction.aggregate([
      {
        $group: {
          _id: "$id",
          total: { $sum: "$amount" },
          profit: { $sum: "$profit" },
        },
      },
      {
        $project: {
          totalAmount: "$total",
          totalProfit: "$profit",
          totalBalance: { $add: ["$total", "$profit"] },
        },
      },
    ]);

    const total = aggregate[0];

    res.json({ total, mapTotal });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  transactionList,
  transactionUserList,
  transactionReqUserList,
  transactionDetail,
  transactionReqUserDetail,
  transactionCreate,
  transactionUpdate,
  transactionDelete,
};
