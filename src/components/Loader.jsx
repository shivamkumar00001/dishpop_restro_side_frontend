// src/components/Loader.jsx
import React from "react";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      {/* Message */}
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}
