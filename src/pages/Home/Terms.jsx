import React from "react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-cyan-400">
          Terms & Conditions
        </h1>

        <p className="text-gray-400">
          Last updated: {new Date().getFullYear()}
        </p>

        {/* 1. Introduction */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p className="text-gray-400">
            Welcome to <strong>Dishpop</strong>. These Terms and Conditions
            ("Terms") govern your access to and use of our platform, services,
            applications, and technologies related to augmented reality dining
            solutions. By accessing or using Dishpop, you agree to be bound by
            these Terms.
          </p>
        </section>

        {/* 2. Eligibility */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Eligibility</h2>
          <p className="text-gray-400">
            You must be at least 18 years old and legally capable of entering
            into a binding agreement to use our services. By registering on
            Dishpop, you represent that all information you provide is accurate
            and complete.
          </p>
        </section>

        {/* 3. Services */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Services Provided</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Augmented reality menu visualization</li>
            <li>AI-powered insights and analytics</li>
            <li>Customer engagement and ordering tools</li>
            <li>Operational and performance analytics</li>
          </ul>
        </section>

        {/* 4. Account */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Account Responsibilities</h2>
          <p className="text-gray-400">
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities under your account.
          </p>
        </section>

        {/* 5. Acceptable Use */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Acceptable Use Policy</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Unlawful or fraudulent activity</li>
            <li>Unauthorized system access</li>
            <li>Platform disruption or abuse</li>
            <li>Uploading malicious content</li>
          </ul>
        </section>

        {/* 6. Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
          <p className="text-gray-400">
            All content, trademarks, logos, and technology on Dishpop are the
            exclusive property of Dishpop or its licensors.
          </p>
        </section>

        {/* 7. Payments */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Payments & Subscriptions</h2>
          <p className="text-gray-400">
            Certain features may require payment. Failure to pay may result in
            suspension or termination.
          </p>
        </section>

        {/* 8. Termination */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Termination</h2>
          <p className="text-gray-400">
            Dishpop may suspend or terminate accounts that violate these Terms.
          </p>
        </section>

        {/* 9. Disclaimer */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Disclaimer</h2>
          <p className="text-gray-400">
            Dishpop is provided “as is” without warranties of any kind.
          </p>
        </section>

        {/* 10. Liability */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Limitation of Liability</h2>
          <p className="text-gray-400">
            Dishpop shall not be liable for indirect or consequential damages.
          </p>
        </section>

        {/* 11. Law */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Governing Law</h2>
          <p className="text-gray-400">
            These Terms are governed by the laws of India.
          </p>
        </section>

        {/* 12–22 Additional Clauses */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">12. Data Protection & Privacy</h2>
          <p className="text-gray-400">
            Dishpop processes data in accordance with applicable data protection
            laws. Refer to our Privacy Policy for details.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">13. Cookies</h2>
          <p className="text-gray-400">
            Dishpop uses cookies to improve platform performance and experience.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">14. Restaurant Partner Obligations</h2>
          <p className="text-gray-400">
            Restaurant partners are responsible for content accuracy and legal
            compliance.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">15. Indemnification</h2>
          <p className="text-gray-400">
            You agree to indemnify Dishpop against claims arising from misuse.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">16. Force Majeure</h2>
          <p className="text-gray-400">
            Dishpop is not liable for events beyond reasonable control.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">17. Contact</h2>
          <p className="text-gray-300 font-medium">
            Email: dispopofficial@gmail.com <br />
           </p>
        </section>
      </div>
    </div>
  );
}
