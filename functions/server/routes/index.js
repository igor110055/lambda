const routes = require("express").Router();

// sub routes
const authRoute = require("./auth");
const profileRoute = require("./profile");
const userRoute = require("./user");
const walletRoute = require("./wallet");
const messageRoute = require("./message");
const paymentRoute = require("./payment");
const transactionRoute = require("./transaction");
const servicesRoute = require("./services");
const bankRoute = require("./bank");

// middlewares
const auth = require("../middlewares/auth");

// routes
routes.get("/", (req, res) => {
  res.json({ ping: "pong" });
});

routes.use("/auth", authRoute);
routes.use("/profile", profileRoute);
routes.use("/core", servicesRoute);

// apply auth middleware to require req user beyond this point
routes.use(auth);

routes.use("/users", userRoute);
routes.use("/wallets", walletRoute);
routes.use("/messages", messageRoute);
routes.use("/payments", paymentRoute);
routes.use("/transactions", transactionRoute);
routes.use("/bank", bankRoute);

module.exports = routes;
