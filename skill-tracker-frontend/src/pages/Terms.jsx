import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="max-w-4xl mx-auto py-24 px-4">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="text-base text-gray-700">These are the terms of service for Skill Tracker. Replace with your official terms.</p>
      </main>
      <Footer />
    </div>
  );
}
