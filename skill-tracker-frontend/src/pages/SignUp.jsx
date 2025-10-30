import React, { useState, useEffect, useCallback, useMemo } from "react";
import { auth, googleProvider } from "../firebase/firebaseClient";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import API from "../utils/api";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import * as FaIcons from "react-icons/fa";
const { FaGoogle } = FaIcons;
import { useTheme } from "../components/ThemeProvider";

const themeConfig = {
  system: {
    background: "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]",
    image: "/bg-system.png",
    card: "backdrop-blur-md bg-white/10 border-white/20",
    text: "text-white",
    input:
      "border-white/20 bg-white/5 text-white placeholder-gray-400 focus:ring-purple-500",
    blob: [
      { class: "bg-purple-500", style: "opacity-30" },
      { class: "bg-pink-500", style: "opacity-30 animation-delay-2000" },
    ],
    border: "border-purple-400/30",
    separatorText: "text-gray-400",
  },
  dark: {
    background: "bg-black",
    image: "/bg-dark.png",
    card: "backdrop-blur-md bg-gray-900/80 border-gray-700/50",
    text: "text-white",
    input:
      "border-gray-600/50 bg-gray-800/50 text-white placeholder-gray-400 focus:ring-purple-500",
    blob: [
      { class: "bg-purple-600", style: "opacity-20" },
      { class: "bg-blue-600", style: "opacity-20 animation-delay-2000" },
    ],
    border: "border-purple-400/20",
    separatorText: "text-gray-400",
  },
  light: {
    background: "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100",
    image: "/bg-light.png",
    card: "backdrop-blur-md bg-white/80 border-gray-200/50",
    text: "text-gray-800",
    input:
      "border-gray-300/50 bg-white/80 text-gray-800 placeholder-gray-500 focus:ring-purple-500",
    blob: [
      { class: "bg-blue-200", style: "opacity-40" },
      { class: "bg-purple-200", style: "opacity-40 animation-delay-2000" },
    ],
    border: "border-purple-400/30",
    separatorText: "text-gray-500",
  },
};

function Blobs({ theme }) {
  return (
    <>
      {themeConfig[theme].blob.map((b, idx) => (
        <div
          key={idx}
          className={`absolute ${
            idx === 0 ? "top-1/4 left-1/4" : "bottom-1/4 right-1/4"
          } w-96 h-96 ${
            b.class
          } rounded-full mix-blend-multiply filter blur-3xl ${
            b.style
          } animate-blob`}
        ></div>
      ))}
    </>
  );
}

export default function SignUp() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { theme, getActualTheme } = useTheme();
  const actualTheme = useMemo(() => getActualTheme(), [getActualTheme]);
  const config = themeConfig[actualTheme];

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) handleGoogleUser(result.user);
      })
      .catch(console.error);
  }, []);

  const validateInputs = useCallback(() => {
    const { firstName, lastName, email, password } = form;
    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  }, [form]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: `${form.firstName} ${form.lastName}`,
      });
      await API.post("/auth/register", {
        firstName: form.firstName,
        lastName: form.lastName,
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

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider).catch(
        (err) => {
          if (err.code === "auth/popup-blocked") {
            return signInWithRedirect(auth, googleProvider);
          }
          throw err;
        }
      );
      if (result?.user) await handleGoogleUser(result.user);
    } catch (error) {
      if (error.code !== "auth/cancelled-popup-request") {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleUser = async (user) => {
    let [googleFirstName = "", googleLastName = ""] =
      user.displayName?.split(" ") || [];
    if (!googleFirstName || !googleLastName) {
      googleFirstName = prompt("Enter your first name:", "") || "";
      googleLastName = prompt("Enter your last name:", "") || "";
    }
    await updateProfile(user, {
      displayName: `${googleFirstName} ${googleLastName}`,
    });
    await API.post("/auth/google", {
      firstName: googleFirstName,
      lastName: googleLastName,
      email: user.email,
      uid: user.uid,
    });
    navigate("/dashboard");
  };

  const handleInputChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center p-4 ${config.background} ${config.text} overflow-hidden transition-all duration-500 bg-no-repeat bg-cover bg-center`}
      style={{ backgroundImage: `url(${config.image})` }}
    >
      <Blobs theme={actualTheme} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`relative z-10 p-8 w-full max-w-md rounded-3xl shadow-lg border transition-all duration-500 ${config.card}`}
        style={{
          boxShadow:
            actualTheme === "system"
              ? "0 0 50px rgba(107,63,255,0.4)"
              : actualTheme === "dark"
              ? "0 0 50px rgba(0,0,0,0.6)"
              : "0 0 50px rgba(156,163,175,0.3)",
        }}
        aria-busy={loading}
      >
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-3xl">
            <div
              className="loader border-t-4 border-b-4 border-purple-500 w-12 h-12 rounded-full animate-spin"
              aria-label="Loading"
            ></div>
          </div>
        )}

        <h2
          className={`text-4xl font-extrabold text-center mb-6 transition-all duration-500 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600`}
        >
          Create Account
        </h2>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mb-4 text-center"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <label className="sr-only" htmlFor="firstName">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleInputChange}
            className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${config.input}`}
            disabled={loading}
            required
          />
          <label className="sr-only" htmlFor="lastName">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleInputChange}
            className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${config.input}`}
            disabled={loading}
            required
          />
          <label className="sr-only" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${config.input}`}
            disabled={loading}
            required
          />
          <label className="sr-only" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            value={form.password}
            onChange={handleInputChange}
            className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${config.input}`}
            disabled={loading}
            required
            minLength={6}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </motion.button>
        </form>

        <p
          className={`text-sm text-center mt-6 transition-colors duration-300 ${
            actualTheme === "light" ? "text-gray-600" : "text-gray-300"
          }`}
        >
          Already have an account?{" "}
          <Link
            to="/SignIn"
            className="text-purple-400 font-medium hover:underline transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>

        <div className="mt-6 flex items-center justify-center">
          <span
            className={`flex-grow border-t transition-colors duration-300 ${config.border}`}
          ></span>
          <span
            className={`text-xs text-center uppercase mx-4 transition-colors duration-300 ${config.separatorText}`}
          >
            or
          </span>
          <span
            className={`flex-grow border-t transition-colors duration-300 ${config.border}`}
          ></span>
        </div>

        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(234, 67, 53, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`mt-4 w-full font-semibold py-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${
            actualTheme === "light"
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-800"
          }`}
          aria-label="Continue with Google"
        >
          <FaGoogle size={20} className="text-red-500" />
          Continue with Google
        </motion.button>
      </motion.div>
      <style>{`
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
