const router = require("express").Router();
const createError = require("http-errors");
const Joi = require("joi");

// models
const Bank = require("../models/bank");

// middlewares
const permissions = require("../middlewares/permissions");
const validate = require("../middlewares/validate");

// validators
const bankSchema = Joi.object({
  bankName: Joi.string().required(),
  accountName: Joi.string().required(),
  accountNumber: Joi.string().required(),
  id: Joi.string(),
});

router.get("/", async (req, res, next) => {
  try {
    const bank = await Bank.findOne({});
    if (!bank) return next(createError.NotFound("Bank not found"));

    res.json(bank);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  permissions(["admin"]),
  validate(bankSchema),
  async (req, res, next) => {
    try {
      const id = req.body.id;

      const result = req.body;

      const savedBank = await Bank.findByIdAndUpdate(id, result, {
        new: true,
      });
      if (savedBank) {
        return res.json(savedBank);
      } else {
        const bank = new Bank(result);
        const newBank = await bank.save();
        return res.json(newBank);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.post("/delete", permissions(["admin"]), async (req, res, next) => {
  try {
    const id = req.body.id;

    const deletedBank = await Bank.findByIdAndDelete(id);

    if (!deletedBank) return next(createError.NotFound("Bank not found"));

    res.json("Deleted successfully");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
