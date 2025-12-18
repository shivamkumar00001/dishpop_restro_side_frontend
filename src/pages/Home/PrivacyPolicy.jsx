import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400">
            Privacy Policy
          </h1>
          <p className="text-gray-400">
            Last updated: {new Date().getFullYear()}
          </p>
          <p className="text-gray-300 leading-relaxed">
            AR Restro (“AR Restro”, “we”, “our”, or “us”) values your privacy and
            is committed to protecting your personal data. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you use our platform, services, websites, and
            applications (collectively, the “Services”).
          </p>
        </header>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            1. Information We Collect
          </h2>
          <p className="text-gray-400">
            We may collect different types of information depending on how you
            interact with our Services, including:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>
              <span className="text-white font-medium">
                Personal Information:
              </span>{" "}
              Name, email address, phone number, and login credentials.
            </li>
            <li>
              <span className="text-white font-medium">
                Restaurant Information:
              </span>{" "}
              Restaurant name, location, menu data, images, and operational
              details.
            </li>
            <li>
              <span className="text-white font-medium">
                Usage & Analytics Data:
              </span>{" "}
              Interaction logs, feature usage, device information, and
              performance metrics.
            </li>
            <li>
              <span className="text-white font-medium">
                Cookies & Tracking Technologies:
              </span>{" "}
              Session cookies, authentication cookies, and similar technologies
              to enhance user experience.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-400">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>To provide, operate, and maintain our Services</li>
            <li>To personalize and improve user experience</li>
            <li>To analyze usage trends and optimize platform performance</li>
            <li>To communicate updates, support responses, and service notices</li>
            <li>To ensure security, prevent fraud, and enforce policies</li>
            <li>To comply with legal and regulatory obligations</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            3. Data Sharing & Disclosure
          </h2>
          <p className="text-gray-400">
            We do not sell your personal data. We may share information only in
            the following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>
              With trusted service providers who assist us in operating our
              platform (under strict confidentiality agreements)
            </li>
            <li>
              When required by law, legal process, or government request
            </li>
            <li>
              To protect the rights, safety, and security of AR Restro, users,
              or the public
            </li>
            <li>
              In connection with a merger, acquisition, or asset transfer
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            4. Data Security
          </h2>
          <p className="text-gray-400">
            We implement industry-standard technical and organizational
            security measures to protect your data against unauthorized access,
            alteration, disclosure, or destruction. While we strive to protect
            your information, no electronic transmission or storage method is
            100% secure.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            5. Data Retention
          </h2>
          <p className="text-gray-400">
            We retain personal information only for as long as necessary to
            fulfill the purposes outlined in this Privacy Policy, unless a
            longer retention period is required or permitted by law.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            6. Your Rights & Choices
          </h2>
          <p className="text-gray-400">
            Depending on your location, you may have rights regarding your
            personal data, including the right to access, correct, delete, or
            restrict processing of your information.
          </p>
          <p className="text-gray-400">
            To exercise these rights, please contact us using the details
            provided below.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            7. Changes to This Policy
          </h2>
          <p className="text-gray-400">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated revision date. Continued
            use of our Services constitutes acceptance of the revised policy.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            8. Contact Us
          </h2>
          <p className="text-gray-400">
            If you have any questions, concerns, or requests regarding this
            Privacy Policy, please contact us at:
          </p>
          <p className="text-cyan-400 font-medium">
            dispopofficial@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
