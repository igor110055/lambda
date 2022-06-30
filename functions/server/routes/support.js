const router = require("express").Router();
const createError = require("http-errors");
const Joi = require("joi");

// models
const Support = require("../models/support");

// middlewares
const auth = require("../middlewares/auth");
const permissions = require("../middlewares/permissions");
const validate = require("../middlewares/validate");

// validators
const supportSchema = Joi.object({
    whatsapp: Joi.string(),
    id: Joi.string(),
});

router.get("/", async (req, res, next) => {
    try {
        const support = await Support.findOne({});
        if (!support) return next(createError.NotFound("Support unavailable"));

        res.json(support);
    } catch (err) {
        next(err);
    }
});

// apply auth middleware to require req user beyond this point
router.use(auth);

router.post(
    "/",
    permissions(["admin"]),
    validate(supportSchema),
    async (req, res, next) => {
        try {
            const result = req.body;

            if (result.id) {
                const savedSupport = await Support.findByIdAndUpdate(result.id, result, {
                    new: true,
                })
                if (savedSupport) return res.json(savedSupport)
                else throw createError.NotFound("Support missing")
            } else {
                const newSupport = await Support.create(result);
                return res.json(newSupport);
            }
        } catch (err) {
            next(err);
        }
    }
);

router.delete("/:id", permissions(["admin"]), async (req, res, next) => {
    try {
        const id = req.params.id;

        const deletedSupport = await Support.findByIdAndDelete(id);

        if (!deletedSupport) return next(createError.NotFound("Support missing"));

        res.json("Deleted successfully");
    } catch (err) {
        next(err);
    }
});

module.exports = router;
