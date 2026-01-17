// import React from "react";

// export default function TermsOfService() {
//   return (
//     <div className="min-h-screen bg-black text-white px-6 py-16">
//       <div className="max-w-4xl mx-auto space-y-8">
//         <h1 className="text-4xl font-bold text-cyan-400">
//           Terms & Conditions
//         </h1>

//         <p className="text-gray-400">
//           Last updated: {new Date().getFullYear()}
//         </p>

//         {/* 1. Introduction */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">1. Introduction</h2>
//           <p className="text-gray-400">
//             Welcome to <strong>Dishpop</strong>. These Terms and Conditions
//             ("Terms") govern your access to and use of our platform, services,
//             applications, and technologies related to augmented reality dining
//             solutions. By accessing or using Dishpop, you agree to be bound by
//             these Terms.
//           </p>
//         </section>

//         {/* 2. Eligibility */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">2. Eligibility</h2>
//           <p className="text-gray-400">
//             You must be at least 18 years old and legally capable of entering
//             into a binding agreement to use our services. By registering on
//             Dishpop, you represent that all information you provide is accurate
//             and complete.
//           </p>
//         </section>

//         {/* 3. Services */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">3. Services Provided</h2>
//           <ul className="list-disc list-inside text-gray-400 space-y-2">
//             <li>Augmented reality menu visualization</li>
//             <li>AI-powered insights and analytics</li>
//             <li>Customer engagement and ordering tools</li>
//             <li>Operational and performance analytics</li>
//           </ul>
//         </section>

//         {/* 4. Account */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">4. Account Responsibilities</h2>
//           <p className="text-gray-400">
//             You are responsible for maintaining the confidentiality of your
//             account credentials and for all activities under your account.
//           </p>
//         </section>

//         {/* 5. Acceptable Use */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">5. Acceptable Use Policy</h2>
//           <ul className="list-disc list-inside text-gray-400 space-y-2">
//             <li>Unlawful or fraudulent activity</li>
//             <li>Unauthorized system access</li>
//             <li>Platform disruption or abuse</li>
//             <li>Uploading malicious content</li>
//           </ul>
//         </section>

//         {/* 6. Intellectual Property */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
//           <p className="text-gray-400">
//             All content, trademarks, logos, and technology on Dishpop are the
//             exclusive property of Dishpop or its licensors.
//           </p>
//         </section>

//         {/* 7. Payments */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">7. Payments & Subscriptions</h2>
//           <p className="text-gray-400">
//             Certain features may require payment. Failure to pay may result in
//             suspension or termination.
//           </p>
//         </section>

//         {/* 8. Termination */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">8. Termination</h2>
//           <p className="text-gray-400">
//             Dishpop may suspend or terminate accounts that violate these Terms.
//           </p>
//         </section>

//         {/* 9. Disclaimer */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">9. Disclaimer</h2>
//           <p className="text-gray-400">
//             Dishpop is provided “as is” without warranties of any kind.
//           </p>
//         </section>

//         {/* 10. Liability */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">10. Limitation of Liability</h2>
//           <p className="text-gray-400">
//             Dishpop shall not be liable for indirect or consequential damages.
//           </p>
//         </section>

//         {/* 11. Law */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">11. Governing Law</h2>
//           <p className="text-gray-400">
//             These Terms are governed by the laws of India.
//           </p>
//         </section>

//         {/* 12–22 Additional Clauses */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">12. Data Protection & Privacy</h2>
//           <p className="text-gray-400">
//             Dishpop processes data in accordance with applicable data protection
//             laws. Refer to our Privacy Policy for details.
//           </p>
//         </section>

//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">13. Cookies</h2>
//           <p className="text-gray-400">
//             Dishpop uses cookies to improve platform performance and experience.
//           </p>
//         </section>

//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">14. Restaurant Partner Obligations</h2>
//           <p className="text-gray-400">
//             Restaurant partners are responsible for content accuracy and legal
//             compliance.
//           </p>
//         </section>

//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">15. Indemnification</h2>
//           <p className="text-gray-400">
//             You agree to indemnify Dishpop against claims arising from misuse.
//           </p>
//         </section>

//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">16. Force Majeure</h2>
//           <p className="text-gray-400">
//             Dishpop is not liable for events beyond reasonable control.
//           </p>
//         </section>

//         <section className="space-y-4">
//           <h2 className="text-2xl font-semibold">17. Contact</h2>
//           <p className="text-gray-300 font-medium">
//             Email: connect@dishpop.in   <br />
//            </p>
//         </section>
//       </div>
//     </div>
//   );
// }



import React, { useEffect } from "react";
import { FileText, UserCheck, Shield, CreditCard, XCircle, AlertTriangle, Scale, Globe, Cookie, Briefcase, Users, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Lenis from '@studio-freight/lenis';

const GradientText = ({ children, className }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 ${className}`}>
    {children}
  </span>
);

export default function TermsOfService() {
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
      title: "Introduction",
      content: `Welcome to Dishpop. These Terms and Conditions ("Terms") govern your access to and use of our platform, services, applications, and technologies related to augmented reality dining solutions. By accessing or using Dishpop, you agree to be bound by these Terms.`
    },
    {
      icon: UserCheck,
      title: "Eligibility",
      content: "You must be at least 18 years old and legally capable of entering into a binding agreement to use our services. By registering on Dishpop, you represent that all information you provide is accurate and complete."
    },
    {
      icon: Briefcase,
      title: "Services Provided",
      items: [
        "Augmented reality menu visualization",
        "AI-powered insights and analytics",
        "Customer engagement and ordering tools",
        "Operational and performance analytics"
      ]
    },
    {
      icon: Shield,
      title: "Account Responsibilities",
      content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account."
    },
    {
      icon: AlertTriangle,
      title: "Acceptable Use Policy",
      content: "You agree not to engage in any of the following prohibited activities:",
      items: [
        "Unlawful or fraudulent activity",
        "Unauthorized system access",
        "Platform disruption or abuse",
        "Uploading malicious content"
      ]
    },
    {
      icon: Scale,
      title: "Intellectual Property",
      content: "All content, trademarks, logos, and technology on Dishpop are the exclusive property of Dishpop or its licensors."
    },
    {
      icon: CreditCard,
      title: "Payments & Subscriptions",
      content: "Certain features may require payment. Failure to pay may result in suspension or termination."
    },
    {
      icon: XCircle,
      title: "Termination",
      content: "Dishpop may suspend or terminate accounts that violate these Terms."
    },
    {
      icon: AlertTriangle,
      title: "Disclaimer",
      content: 'Dishpop is provided "as is" without warranties of any kind.'
    },
    {
      icon: Shield,
      title: "Limitation of Liability",
      content: "Dishpop shall not be liable for indirect or consequential damages."
    },
    {
      icon: Globe,
      title: "Governing Law",
      content: "These Terms are governed by the laws of India."
    },
    {
      icon: Shield,
      title: "Data Protection & Privacy",
      content: "Dishpop processes data in accordance with applicable data protection laws. Refer to our Privacy Policy for details."
    },
    {
      icon: Cookie,
      title: "Cookies",
      content: "Dishpop uses cookies to improve platform performance and experience."
    },
    {
      icon: Users,
      title: "Restaurant Partner Obligations",
      content: "Restaurant partners are responsible for content accuracy and legal compliance."
    },
    {
      icon: Shield,
      title: "Indemnification",
      content: "You agree to indemnify Dishpop against claims arising from misuse."
    },
    {
      icon: AlertTriangle,
      title: "Force Majeure",
      content: "Dishpop is not liable for events beyond reasonable control."
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
              <Scale className="w-3 h-3" />
              Legal Agreement
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1]"
            >
              Terms & <GradientText>Conditions</GradientText>
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
                Please read these terms and conditions carefully before using our platform.
                By accessing or using Dishpop, you agree to be bound by these Terms.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-20 px-6 md:px-20 lg:px-32">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        {index + 1}. {section.title}
                      </h2>
                      
                      {section.content && (
                        <p className="text-slate-600 leading-relaxed mb-4">
                          {section.content}
                        </p>
                      )}
                      
                      {section.items && (
                        <ul className="space-y-3">
                          {section.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                              <span className="text-slate-600">{item}</span>
                            </li>
                          ))}
                        </ul>
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
                    17. Contact
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    If you have any questions or concerns about these Terms and Conditions, please contact us:
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
              <a href="/privacy-policy" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="/contact" className="hover:text-blue-600 transition-colors">
                Contact
              </a>
              <a href="/about" className="hover:text-blue-600 transition-colors">
                About us
              </a>
              <a href="/terms-of-service" className="hover:text-blue-600 transition-colors text-blue-600">
                Terms Policy
              </a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}