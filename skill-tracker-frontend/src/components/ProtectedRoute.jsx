import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseClient";

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <p>Loading...</p>; // Replace with spinner if you have one
  }

  if (!user) {
    return <Navigate to="/SignIn" replace />;
  }

  return children;
}
