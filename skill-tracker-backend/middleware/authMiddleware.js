// skill-tracker-backend/middleware/authMiddleware.js
import admin from "../config/firebaseAdmin.js";

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/^Bearer (.+)$/);

    if (!match) {
      return res
        .status(401)
        .json({ message: "Authorization header missing or invalid." });
    }

    const idToken = match[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // ✅ use uid instead of id for consistency
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default verifyFirebaseToken;
