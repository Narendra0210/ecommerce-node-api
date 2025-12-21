// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // TLS
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   },
//   tls: {
//     rejectUnauthorized: false
//   },
//   connectionTimeout: 10000, // 10 sec
//   greetingTimeout: 10000,
//   socketTimeout: 10000
// });

// module.exports = transporter;


// const SibApiV3Sdk = require("sib-api-v3-sdk");

// const client = SibApiV3Sdk.ApiClient.instance;
// client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

// const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// module.exports = emailApi;


require("dotenv").config(); // 🔴 MUST be on top

const { Resend } = require("resend");

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is missing");
}
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = resend;

exports.sendVerificationEmail = async ({ to, name, verifyLink }) => {
  return await resend.emails.send({
    from: "krnarendra2000@gmail.com",
    to,
    subject: "Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Hello ${name},</h2>
        <p>Please verify your email by clicking the button below:</p>
        <a 
          href="${verifyLink}" 
          style="
            display:inline-block;
            padding:10px 20px;
            background:#4F46E5;
            color:#fff;
            text-decoration:none;
            border-radius:5px;
          "
        >
          Verify Email
        </a>
        <p style="margin-top:20px;">
          If you didn’t create an account, you can ignore this email.
        </p>
      </div>
    `
  });
};

