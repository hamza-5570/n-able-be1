const sgMail = require("@sendgrid/mail");
const fs = require("fs");
sgMail.setApiKey(
  "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"
);

function emailSender(to, from, subject, html) {
  const msg = {
    to: "contact@data-safe.net", // Change to your recipient
    from: "whatsappcontactdownload@gmail.com", // Change to your verified sender
    subject: subject,
    html: html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      return;
    })
    .catch((error) => {
      console.error("errors=>", error);
    });
  return;
}

function emailSender2(to, from, subject, html) {
  const msg = {
    to: to, // Change to your recipient
    from: "whatsappcontactdownload@gmail.com", // Change to your verified sender
    subject: subject,
    html: html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      return;
    })
    .catch((error) => {
      console.error("errors=>", error);
    });
  return;
}

module.exports = {
  emailSender,
  emailSender2
};
