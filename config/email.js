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


require("dotenv").config();

const { Resend } = require("resend");

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is missing");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async ({ to, name, verifyLink }) => {
  const response = await resend.emails.send({
    from: "Ecommerce App <onboarding@resend.dev>", // ✅ MUST USE THIS
    to: [to], // ⚠️ array is REQUIRED
    subject: "Verify your email",
    html: `
      <h3>Hello ${name}</h3>
      <p>Please verify your email:</p>
      <a href="${verifyLink}">Verify Email</a>
    `
  });

  console.log("RESEND RESPONSE:", response);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response;
};
