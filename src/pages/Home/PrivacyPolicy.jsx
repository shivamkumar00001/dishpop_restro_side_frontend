// import React from "react";

// export default function PrivacyPolicy() {
//   return (
//     <div className="min-h-screen bg-black text-white px-6 py-16">
//       <div className="max-w-5xl mx-auto space-y-10">
//         {/* Header */}
//         <header className="space-y-4">
//           <h1 className="text-4xl md:text-5xl font-bold text-cyan-400">
//             Privacy Policy
//           </h1>
//           <p className="text-gray-400">
//             Last updated: {new Date().getFullYear()}
//           </p>
//           <p className="text-gray-300 leading-relaxed">
//             Dishpop (“Dispop”, “we”, “our”, or “us”) values your privacy and
//             is committed to protecting your personal data. This Privacy Policy
//             explains how we collect, use, disclose, and safeguard your
//             information when you use our platform, services, websites, and
//             applications (collectively, the “Services”).
//           </p>
//         </header>

//         {/* Section 1 */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">
//             1. Information We Collect
//           </h2>
//           <p className="text-gray-400">
//             We may collect different types of information depending on how you
//             interact with our Services, including:
//           </p>
//           <ul className="list-disc list-inside text-gray-400 space-y-2">
//             <li>
//               <span className="text-white font-medium">
//                 Personal Information:
//               </span>{" "}
//               Name, email address, phone number, and login credentials.
//             </li>
//             <li>
//               <span className="text-white font-medium">
//                 Restaurant Information:
//               </span>{" "}
//               Restaurant name, location, menu data, images, and operational
//               details.
//             </li>
//             <li>
//               <span className="text-white font-medium">
//                 Usage & Analytics Data:
//               </span>{" "}
//               Interaction logs, feature usage, device information, and
//               performance metrics.
//             </li>
//             <li>
//               <span className="text-white font-medium">
//                 Cookies & Tracking Technologies:
//               </span>{" "}
//               Session cookies, authentication cookies, and similar technologies
//               to enhance user experience.
//             </li>
//           </ul>
//         </section>

//         {/* Section 2 */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">
//             2. How We Use Your Information
//           </h2>
//           <p className="text-gray-400">
//             We use the information we collect for the following purposes:
//           </p>
//           <ul className="list-disc list-inside text-gray-400 space-y-2">
//             <li>To provide, operate, and maintain our Services</li>
//             <li>To personalize and improve user experience</li>
//             <li>To analyze usage trends and optimize platform performance</li>
//             <li>To communicate updates, support responses, and service notices</li>
//             <li>To ensure security, prevent fraud, and enforce policies</li>
//             <li>To comply with legal and regulatory obligations</li>
//           </ul>
//         </section>

//         {/* Section 3 */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">
//             3. Data Sharing & Disclosure
//           </h2>
//           <p className="text-gray-400">
//             We do not sell your personal data. We may share information only in
//             the following circumstances:
//           </p>
//           <ul className="list-disc list-inside text-gray-400 space-y-2">
//             <li>
//               With trusted service providers who assist us in operating our
//               platform (under strict confidentiality agreements)
//             </li>
//             <li>
//               When required by law, legal process, or government request
//             </li>
//             <li>
//               To protect the rights, safety, and security of Dishpop, users,
//               or the public
//             </li>
//             <li>
//               In connection with a merger, acquisition, or asset transfer
//             </li>
//           </ul>
//         </section>

//         {/* Section 4 */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">
//             4. Data Security
//           </h2>
//           <p className="text-gray-400">
//             We implement industry-standard technical and organizational
//             security measures to protect your data against unauthorized access,
//             alteration, disclosure, or destruction. While we strive to protect
//             your information, no electronic transmission or storage method is
//             100% secure.
//           </p>
//         </section>

//         {/* Section 5 */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">
//             5. Data Retention
//           </h2>
//           <p className="text-gray-400">
//             We retain personal information only for as long as necessary to
//             fulfill the purposes outlined in this Privacy Policy, unless a
//             longer retention period is required or permitted by law.
//           </p>
//         </section>

//         {/* Section 6 */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">
//             6. Your Rights & Choices
//           </h2>
//           <p className="text-gray-400">
//             Depending on your location, you may have rights regarding your
//             personal data, including the right to access, correct, delete, or
//             restrict processing of your information.
//           </p>
//           <p className="text-gray-400">
//             To exercise these rights, please contact us using the details
//             provided below.
//           </p>
//         </section>

//         {/* Section 7 */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">
//             7. Changes to This Policy
//           </h2>
//           <p className="text-gray-400">
//             We may update this Privacy Policy from time to time. Any changes
//             will be posted on this page with an updated revision date. Continued
//             use of our Services constitutes acceptance of the revised policy.
//           </p>
//         </section>

//         {/* Section 8 */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">
//             8. Contact Us
//           </h2>
//           <p className="text-gray-400">
//             If you have any questions, concerns, or requests regarding this
//             Privacy Policy, please contact us at:
//           </p>
//           <p className="text-cyan-400 font-medium">
//               connect@dishpop.in          </p>
//         </section>
//       </div>
//     </div>
//   );
// }



import React, { useEffect } from "react";
import { Shield, Lock, Eye, UserCheck, FileText, Mail, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Lenis from '@studio-freight/lenis';

const GradientText = ({ children, className }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 ${className}`}>
    {children}
  </span>
);

export default function PrivacyPolicy() {
  // Lenis Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const sections = [
    {
      icon: FileText,
      title: "Information We Collect",
      content: "We may collect different types of information depending on how you interact with our Services, including:",
      items: [
        {
          label: "Personal Information:",
          description: "Name, email address, phone number, and login credentials."
        },
        {
          label: "Restaurant Information:",
          description: "Restaurant name, location, menu data, images, and operational details."
        },
        {
          label: "Usage & Analytics Data:",
          description: "Interaction logs, feature usage, device information, and performance metrics."
        },
        {
          label: "Cookies & Tracking Technologies:",
          description: "Session cookies, authentication cookies, and similar technologies to enhance user experience."
        }
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: "We use the information we collect for the following purposes:",
      items: [
        { description: "To provide, operate, and maintain our Services" },
        { description: "To personalize and improve user experience" },
        { description: "To analyze usage trends and optimize platform performance" },
        { description: "To communicate updates, support responses, and service notices" },
        { description: "To ensure security, prevent fraud, and enforce policies" },
        { description: "To comply with legal and regulatory obligations" }
      ]
    },
    {
      icon: UserCheck,
      title: "Data Sharing & Disclosure",
      content: "We do not sell your personal data. We may share information only in the following circumstances:",
      items: [
        { description: "With trusted service providers who assist us in operating our platform (under strict confidentiality agreements)" },
        { description: "When required by law, legal process, or government request" },
        { description: "To protect the rights, safety, and security of Dishpop, users, or the public" },
        { description: "In connection with a merger, acquisition, or asset transfer" }
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "We implement industry-standard technical and organizational security measures to protect your data against unauthorized access, alteration, disclosure, or destruction. While we strive to protect your information, no electronic transmission or storage method is 100% secure."
    },
    {
      icon: Clock,
      title: "Data Retention",
      content: "We retain personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law."
    },
    {
      icon: Shield,
      title: "Your Rights & Choices",
      content: "Depending on your location, you may have rights regarding your personal data, including the right to access, correct, delete, or restrict processing of your information.",
      extraContent: "To exercise these rights, please contact us using the details provided below."
    },
    {
      icon: AlertCircle,
      title: "Changes to This Policy",
      content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of our Services constitutes acceptance of the revised policy."
    }
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* --- SUBTLE FILM GRAIN --- */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-center">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-100 px-6 py-3 rounded-full shadow-sm flex items-center gap-8 transition-all hover:bg-white">
          <span className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full shadow-lg shadow-blue-500/20" /> DISHPOP
          </span>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
            <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="/about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Features</a>
          </div>
          <button className="bg-slate-900 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all shadow-lg hover:bg-blue-600">
            Sign In
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-24">
        
        {/* Header Section */}
        <section className="min-h-[50vh] flex items-center justify-center px-6 md:px-20 lg:px-32 py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase"
            >
              <Shield className="w-3 h-3" />
              Legal
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1]"
            >
              <GradientText>Privacy Policy</GradientText>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <p className="text-slate-500 text-sm">
                Last updated: {new Date().getFullYear()}
              </p>
              <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
                Dishpop ("Dishpop", "we", "our", or "us") values your privacy and
                is committed to protecting your personal data. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you use our platform, services, websites, and
                applications (collectively, the "Services").
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-20 px-6 md:px-20 lg:px-32">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        {index + 1}. {section.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed mb-4">
                        {section.content}
                      </p>
                      
                      {section.items && (
                        <ul className="space-y-3">
                          {section.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                              <div className="flex-1">
                                {item.label && (
                                  <span className="font-semibold text-slate-900">
                                    {item.label}{" "}
                                  </span>
                                )}
                                <span className="text-slate-600">
                                  {item.description}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.extraContent && (
                        <p className="text-slate-600 leading-relaxed mt-4">
                          {section.extraContent}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-blue-200 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                    8. Contact Us
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    If you have any questions, concerns, or requests regarding this
                    Privacy Policy, please contact us at:
                  </p>
                  <a 
                    href="mailto:connect@dishpop.in"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    connect@dishpop.in
                  </a>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-slate-100 bg-white text-slate-500 text-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded-full shadow-lg shadow-blue-500/30" />
              <span className="font-bold text-slate-900 text-lg">Dishpop</span>
            </div>
            <div className="flex gap-8 font-medium">
              <a href="/privacy-policy" className="hover:text-blue-600 transition-colors text-blue-600">
                Privacy Policy
              </a>
              <a href="/contact" className="hover:text-blue-600 transition-colors">
                Contact
              </a>
              <a href="/about" className="hover:text-blue-600 transition-colors">
                About us
              </a>
              <a href="/terms-of-service" className="hover:text-blue-600 transition-colors">
                Terms Policy
              </a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}