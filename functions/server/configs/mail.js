const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const options = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY || "api_key",
    domain: `mg.${process.env.REACT_APP_DOMAIN}`,
  },
};

const advancedTransporter = nodemailer.createTransport(mg(options));

const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.REACT_APP_EMAIL,
    pass: process.env.REACT_APP_PASS,
  },
});

const advancedMode =
  process.env.REACT_APP_ADVANCED_MAILER &&
  process.env.REACT_APP_ADVANCED_MAILER.toLowerCase() === "true";

// const transporter = advancedMode ? advancedTransporter : gmailTransporter;
const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
});

const template = (file, context) => {
  const source = fs.readFileSync(
    path.join(__dirname, `../templates/${file}.hbs`),
    "utf8"
  );
  const hbsTemplate = handlebars.compile(source);

  return hbsTemplate(context);
};

const app_name = process.env.REACT_APP_NAME;
const app_address = process.env.REACT_APP_ADDRESS;
const support_email = advancedMode
  ? "support@" + process.env.REACT_APP_DOMAIN
  : process.env.REACT_APP_EMAIL;
const home_url = "https://" + process.env.REACT_APP_DOMAIN;
const live_chat_url = process.env.REACT_APP_CHAT_URL;
const date = new Date().getFullYear();
const from = `${app_name} <${support_email}>`;

const mailer = async (options) => {
  if (options.inbound) {
    const { inbound, ...inboundOptions } = options;
    return transporter.sendMail(inboundOptions);
  }
  const { template: file, context: mailContext, ...restOptions } = options;

  const context = {
    app_name,
    app_address,
    support_email,
    home_url,
    live_chat_url,
    date,
    ...mailContext,
  };
  const mailOptions = { from, ...restOptions, html: template(file, context) };

  if (!advancedMode) mailOptions.from = from;

  return transporter.sendMail(mailOptions);
};

module.exports = mailer;
