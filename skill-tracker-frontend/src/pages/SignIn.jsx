// src/pages/SignIn.jsx
import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase/firebaseClient";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import API from "../utils/api";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaGoogle } from "react-icons/fa"; // Using react-icons for a modern look
import { useTheme } from "../components/ThemeProvider";

// This component will be the login page for the Skill Tracker app.
// It features a dark, gradient background with a sleek, translucent
// card using glassmorphism for a modern UI feel.
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { theme, getActualTheme } = useTheme();

  // Get the actual theme that should be applied
  const isDark = getActualTheme() === "dark";

  // Redirect if the user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Handle redirect result for Google sign-in
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          handleGoogleUser(result.user);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Handler for email and password login
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await API.post("/auth/login", {
        email: user.email,
        uid: user.uid,
      });

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler for Google sign-in
  const handleGoogleSignIn = async () => {
    if (loading) return;
    setError("");
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider).catch(
        (err) => {
          if (err.code === "auth/popup-blocked") {
            return signInWithRedirect(auth, googleProvider);
          } else {
            throw err;
          }
        }
      );
      if (result && result.user) {
        await handleGoogleUser(result.user);
      }
    } catch (error) {
      if (error.code !== "auth/cancelled-popup-request") {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the Google user after successful sign-in
  const handleGoogleUser = async (user) => {
    let googleFirstName = user.displayName?.split(" ")[0] || "";
    let googleLastName = user.displayName?.split(" ")[1] || "";

    if (!googleFirstName || !googleLastName) {
      googleFirstName = prompt("Enter your first name:", "") || "";
      googleLastName = prompt("Enter your last name:", "") || "";
    }

    await API.post("/auth/google", {
      firstName: googleFirstName,
      lastName: googleLastName,
      email: user.email,
      uid: user.uid,
    });

    navigate("/dashboard");
  };

  // Get background based on theme
  const getBackground = () => {
    if (theme === "system") {
      return "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]";
    } else if (theme === "dark") {
      return "bg-black";
    } else {
      return "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100";
    }
  };

  // Get card background based on theme
  const getCardBackground = () => {
    if (theme === "system") {
      return "backdrop-blur-md bg-white/10 border-white/20";
    } else if (theme === "dark") {
      return "backdrop-blur-md bg-gray-900/80 border-gray-700/50";
    } else {
      return "backdrop-blur-md bg-white/80 border-gray-200/50";
    }
  };

  // Get text color based on theme
  const getTextColor = () => {
    if (theme === "system" || theme === "dark") {
      return "text-white";
    } else {
      return "text-gray-800";
    }
  };

  // Get input styles based on theme
  const getInputStyles = () => {
    if (theme === "system") {
      return "border-white/20 bg-white/5 text-white placeholder-gray-400 focus:ring-purple-500";
    } else if (theme === "dark") {
      return "border-gray-600/50 bg-gray-800/50 text-white placeholder-gray-400 focus:ring-purple-500";
    } else {
      return "border-gray-300/50 bg-white/80 text-gray-800 placeholder-gray-500 focus:ring-purple-500";
    }
  };

  return (
    // Main container with theme-aware background
    <div
      className={`relative min-h-screen flex items-center justify-center p-4 ${getBackground()} ${getTextColor()} overflow-hidden transition-all duration-500`}
    >
      {/* Background blobs for a dynamic, creative feel */}
      {theme === "system" && (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </>
      )}

      {theme === "dark" && (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </>
      )}

      {theme === "light" && (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        </>
      )}

      {/* The main card with theme-aware glassmorphism effect */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`relative z-10 p-8 w-full max-w-md rounded-3xl shadow-lg border transition-all duration-500 ${getCardBackground()}`}
        style={{
          boxShadow:
            theme === "system"
              ? "0 0 50px rgba(107,63,255,0.4)"
              : theme === "dark"
              ? "0 0 50px rgba(0,0,0,0.6)"
              : "0 0 50px rgba(156,163,175,0.3)",
        }}
      >
        {/* Loading overlay for a smooth user experience */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-3xl">
            <div className="loader border-t-4 border-b-4 border-purple-500 w-12 h-12 rounded-full animate-spin"></div>
          </div>
        )}

        <h2
          className={`text-4xl font-extrabold text-center mb-6 transition-all duration-500 ${
            theme === "system"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600"
              : theme === "dark"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-500"
              : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800"
          }`}
        >
          Welcome Back
        </h2>

        {/* Display error message with animation */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mb-4 text-center"
          >
            {error}
          </motion.p>
        )}

        {/* The sign-in form */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${getInputStyles()}`}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${getInputStyles()}`}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            {loading ? "Signing In..." : "Sign In"}
          </motion.button>
        </form>

        <p
          className={`text-sm text-center mt-6 transition-colors duration-300 ${
            theme === "system" || theme === "dark"
              ? "text-gray-300"
              : "text-gray-600"
          }`}
        >
          Don't have an account?{" "}
          <Link
            to="/SignUp"
            className="text-purple-400 font-medium hover:underline transition-colors duration-200"
          >
            Sign up
          </Link>
        </p>

        {/* Separator with a subtle gradient effect */}
        <div className="mt-6 flex items-center justify-center">
          <span
            className={`flex-grow border-t transition-colors duration-300 ${
              theme === "system"
                ? "border-purple-400/30"
                : theme === "dark"
                ? "border-purple-400/20"
                : "border-purple-400/30"
            }`}
          ></span>
          <span
            className={`text-xs text-center uppercase mx-4 transition-colors duration-300 ${
              theme === "system" || theme === "dark"
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            or
          </span>
          <span
            className={`flex-grow border-t transition-colors duration-300 ${
              theme === "system"
                ? "border-purple-400/30"
                : theme === "dark"
                ? "border-purple-400/20"
                : "border-purple-400/30"
            }`}
          ></span>
        </div>

        {/* Google sign-in button with animated hover effect */}
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(234, 67, 53, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`mt-4 w-full font-semibold py-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${
            theme === "system" || theme === "dark"
              ? "bg-white text-gray-800"
              : "bg-gray-800 text-white"
          }`}
        >
          <FaGoogle size={20} className="text-red-500" />
          Continue with Google
        </motion.button>
      </motion.div>
      <style jsx>{`
        /* Custom CSS for the loading spinner and background blobs */
        .loader {
          border-color: #a855f7;
          border-right-color: transparent;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.6, 0.2, 0.4, 0.8);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
