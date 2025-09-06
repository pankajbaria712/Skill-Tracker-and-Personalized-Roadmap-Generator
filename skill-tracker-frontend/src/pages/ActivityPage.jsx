// src/pages/Activity.jsx
import React from "react";
import Navbar from "../components/Navbar";

export default function Activity() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-20 max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Activity
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Track your recent activity, progress, and updates here.
        </p>
      </div>
    </div>
  );
}
