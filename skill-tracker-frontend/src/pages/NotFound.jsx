import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-3xl text-center">
          <img src="/404.WEBP" alt="404" className="mx-auto w-full max-w-md mb-8" />
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-base text-gray-600 mb-6">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <div>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:opacity-90"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
