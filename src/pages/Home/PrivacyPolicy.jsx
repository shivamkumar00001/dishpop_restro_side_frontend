import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-cyan-400">
          Privacy Policy
        </h1>

        <p className="text-gray-400">
          Last updated: {new Date().getFullYear()}
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p className="text-gray-400">
            AR Restro (“we”, “our”, “us”) respects your privacy and is committed
            to protecting your personal data. This Privacy Policy explains how
            we collect, use, and safeguard your information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Account details (name, email, phone number)</li>
            <li>Restaurant information</li>
            <li>Usage data and analytics</li>
            <li>Cookies and session data</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. How We Use Your Data</h2>
          <p className="text-gray-400">
            We use your data to provide services, improve user experience,
            maintain security, and comply with legal obligations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Data Security</h2>
          <p className="text-gray-400">
            We implement industry-standard security measures to protect your
            data from unauthorized access.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Contact Us</h2>
          <p className="text-gray-400">
            If you have any questions about this Privacy Policy, contact us at:
            <br />
            <span className="text-cyan-400">
              dinearofficial@gmail.com
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}
