import nodemailer from "nodemailer";
import { env } from "../../config/environment.js";
import { dataStore } from "../../repositories/dataStore.js";
import { decryptTokens } from "./tokenVault.js";

const isSmtpConfigured = () => Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS && env.SMTP_FROM);

function escapeHtml(value) {
  return String(value || "").replace(/[&<>\"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

async function sendRegistrationEmail(user) {
  const name = String(user.name || "there");
  const safeName = escapeHtml(name);
  const appUrl = env.APP_URL.replace(/\/$/, "");

  if (isSmtpConfigured()) {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });
    try {
      await transporter.sendMail({
        from: env.SMTP_FROM,
        to: user.email,
        subject: "Welcome to RelayDesk",
        text: `Hi ${name},\n\nYour RelayDesk account has been created. Sign in to finish setting up your workspace: ${appUrl}/login\n\nIf you did not create this account, you can ignore this email.`,
        html: `<p>Hi ${safeName},</p><p>Your RelayDesk account has been created.</p><p><a href="${appUrl}/login">Sign in to finish setting up your workspace</a></p><p>If you did not create this account, you can ignore this email.</p>`
      });
      return { sent: true };
    } finally {
      transporter.close();
    }
  }

  const sender = env.REGISTRATION_EMAIL_FROM.trim().toLowerCase();
  if (!sender || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return { sent: false, reason: "No SMTP credentials or Gmail OAuth sender are configured" };
  }
  const account = (await dataStore.listEmailAccounts()).find((item) =>
    item.provider === "GMAIL" && !item.isSimulated && item.emailAddress.toLowerCase() === sender && item.oauthTokens
  );
  if (!account) return { sent: false, reason: `No authorized Gmail mailbox found for ${sender}` };
  const tokens = decryptTokens(account.oauthTokens);
  if (!tokens.refresh_token) return { sent: false, reason: "The connected Gmail account has no refresh token; reconnect it with offline access" };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: sender,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: tokens.refresh_token
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
  try {
    await transporter.sendMail({
      from: `RelayDesk <${sender}>`,
      to: user.email,
      subject: "Welcome to RelayDesk",
      text: `Hi ${name},\n\nYour RelayDesk account has been created. Sign in to finish setting up your workspace: ${appUrl}/login\n\nIf you did not create this account, you can ignore this email.`,
      html: `<p>Hi ${safeName},</p><p>Your RelayDesk account has been created.</p><p><a href="${appUrl}/login">Sign in to finish setting up your workspace</a></p><p>If you did not create this account, you can ignore this email.</p>`
    });
  } finally {
    transporter.close();
  }
  return { sent: true };
}

export { sendRegistrationEmail };
