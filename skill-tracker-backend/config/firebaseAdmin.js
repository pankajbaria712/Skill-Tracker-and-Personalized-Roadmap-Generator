// skill-tracker-backend/config/firebaseAdmin.js
import admin from "firebase-admin";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseJsonSafe(str) {
  if (!str || str === "undefined") return null;
  try {
    return JSON.parse(str);
  } catch (err) {
    // try to fix common newline escaping in private_key then parse
    try {
      const fixed = str.replace(/\\n/g, "\n");
      return JSON.parse(fixed);
    } catch (err2) {
      return null;
    }
  }
}

let serviceAccount = null;

// 1) Prefer a JSON string in FIREBASE_SERVICE_ACCOUNT (some hosts provide the whole JSON)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = parseJsonSafe(process.env.FIREBASE_SERVICE_ACCOUNT);
  if (!serviceAccount) {
    console.error(
      "FIREBASE_SERVICE_ACCOUNT exists but could not be parsed as JSON."
    );
  }
}

// 2) If not present, assemble from individual env vars (common on Vercel/Heroku)
if (
  !serviceAccount &&
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_CLIENT_EMAIL
) {
  serviceAccount = {
    type: process.env.FIREBASE_TYPE || "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  };
}

// 3) If still not found, try a local file (useful for local dev)
if (!serviceAccount) {
  const localPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    ? join(__dirname, process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
    : join(__dirname, "..", "firebase-service-account.json");

  if (existsSync(localPath)) {
    try {
      const raw = readFileSync(localPath, "utf8");
      serviceAccount = parseJsonSafe(raw);
      if (!serviceAccount) {
        console.error(
          "Local service account file found but could not be parsed as JSON:",
          localPath
        );
      }
    } catch (err) {
      console.error("Error reading local service account file:", err.message);
    }
  }
}

if (!serviceAccount) {
  console.error(
    "\nFirebase service account not provided. Set one of:\n" +
      " - FIREBASE_SERVICE_ACCOUNT (full JSON string)\n" +
      " - FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL (and other optional FIREBASE_* vars)\n" +
      " - a local file at backend/firebase-service-account.json or set FIREBASE_SERVICE_ACCOUNT_PATH\n"
  );
  throw new Error(
    "Missing Firebase service account configuration. See logs for details."
  );
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase admin initialized.");
  } catch (err) {
    console.error("Failed to initialize Firebase admin:", err.message);
    throw err;
  }
}

export default admin;
