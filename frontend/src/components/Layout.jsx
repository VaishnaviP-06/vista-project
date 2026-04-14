// src/components/Layout.jsx
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Page Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {children}
      </div>

    </div>
  );
}