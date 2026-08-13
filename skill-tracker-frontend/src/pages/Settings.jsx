import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";

export default function Settings() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto py-24 px-4">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <p className="text-base text-gray-700">Settings page placeholder.</p>
      </main>
      <Footer />
    </div>
  );
}
