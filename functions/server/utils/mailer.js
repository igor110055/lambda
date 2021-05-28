const mailer = require("../configs/mail");

const app_name = process.env.REACT_APP_NAME;
const appUrl = "https://app." + process.env.REACT_APP_DOMAIN;
const appEmail = process.env.REACT_APP_EMAIL;

const welcomeMail = async (user, emailToken) => {
  const verificationLink = appUrl + "/confirmation/verify-email/" + emailToken;

  const resp = await mailer({
    to: user.email,
    subject: "Welcome to " + app_name,
    template: "welcome",
    context: {
      name: user.firstName,
      action_url: verificationLink,
    },
  });
  return resp;
};

const emailVerificationMail = async (email, emailToken) => {
  const verificationLink = appUrl + "/confirmation/verify-email/" + emailToken;

  const resp = await mailer({
    to: email,
    subject: "Verify Email Address",
    template: "verify-email",
    context: {
      action_url: verificationLink,
    },
  });
  return resp;
};

const passwordResetMail = async (user, passwordToken) => {
  const resetLink = appUrl + "/account/reset-password/" + passwordToken;

  const resp = await mailer({
    to: user.email,
    subject: "Reset Password",
    template: "reset-password",
    context: {
      name: user.firstName,
      action_url: resetLink,
    },
  });
  return resp;
};

const withdrawalMail = async (user, transaction) => {
  console.log("mailing withdrawal");
  await mailer({
    to: user.email,
    subject: "Processing Withdrawal",
    template: "withdrawal",
    context: {
      name: user.firstName,
      amount: Math.abs(transaction.amount),
    },
  });
  await mailer({
    to: appEmail,
    subject: "Withdrawal Request",
    template: "withdrawal-admin",
    context: {
      name: user.firstName + " " + user.lastName,
      email: user.email,
      amount: Math.abs(transaction.amount),
    },
  });
};

const customMailer = async ({ from, email, title, body }) => {
  const resp = await mailer({
    from: `${app_name} <${from}@${process.env.REACT_APP_DOMAIN}>`,
    to: email,
    replyTo: process.env.REACT_APP_EMAIL,
    subject: title,
    template: "custom",
    context: { title, body },
  });
  return resp;
};

const inboundMailer = async ({ from, subject, text, html }) => {
  const resp = await mailer({
    inbound: true,
    from: `${app_name} Postman <postman@${process.env.REACT_APP_DOMAIN}>`,
    to: process.env.REACT_APP_EMAIL,
    subject: subject + " - from: " + from,
    text,
    html,
  });
  return resp;
};

module.exports = {
  welcomeMail,
  emailVerificationMail,
  passwordResetMail,
  withdrawalMail,
  customMailer,
  inboundMailer,
};
