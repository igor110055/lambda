const router = require("express").Router();

// controllers
const TransactionController = require("../controllers/transaction");

//middlewares
const permissions = require("../middlewares/permissions");
const matchId = require("../middlewares/matchId");
const validate = require("../middlewares/validate");
const paginate = require("../middlewares/paginate");

// validators
const {
  transactionSchema,
  transactionUpdateSchema,
  transactionTradeSchema,
} = require("../validators/transaction");

// all transactions
router.get(
  "/admin",
  permissions(["moderator", "admin"]),
  TransactionController.transactionList,
  paginate
);

// all user transactions
router.get(
  "/admin/user/:userId",
  permissions(["moderator", "admin"]),
  TransactionController.transactionUserList,
  paginate
);

// transaction detail
router.get(
  "/admin/:id",
  permissions(["moderator", "admin"]),
  matchId,
  TransactionController.transactionDetail
);

// all req user transactions
router.get("/", TransactionController.transactionReqUserList, paginate);

// req user transaction detail
router.get("/:id", matchId, TransactionController.transactionReqUserDetail);

// new transaction
// further allow only investment and transfer from basic user or moderator
// replace user with req user id before save if not admin
router.post(
  "/",
  validate(transactionSchema),
  TransactionController.transactionCreate
);

// new trade transaction
router.post(
  "/trade",
  validate(transactionTradeSchema),
  TransactionController.transactionCreateTrade
);

// update transaction
router.put(
  "/:id",
  permissions(["admin"]),
  matchId,
  validate(transactionUpdateSchema),
  TransactionController.transactionUpdate
);

// delete transaction
router.delete(
  "/:id",
  permissions(["admin"]),
  matchId,
  TransactionController.transactionDelete
);

module.exports = router;
