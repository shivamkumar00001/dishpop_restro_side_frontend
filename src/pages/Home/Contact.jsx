import React, { useState, useEffect } from "react";
import { Mail, MapPin, Loader2, Send, Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import Lenis from '@studio-freight/lenis';
import api from "../../services/api"; // 👈 axios instance

const GradientText = ({ children, className }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 ${className}`}>
    {children}
  </span>
);

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await api.post("/contact", form);

      setStatus({
        type: "success",
        message: res.data.message || "Message sent successfully!",
      });

      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "connect@dishpop.in",
      link: "mailto:connect@dishpop.in"
    },
    {
      icon: MapPin,
      title: "Location",
      content: "India",
      link: null
    },
    {
      icon: MessageCircle,
      title: "Support",
      content: "24/7 Available",
      link: null
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
        <section className="min-h-[40vh] flex items-center justify-center px-6 md:px-20 lg:px-32 py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase"
            >
              <MessageCircle className="w-3 h-3" />
              Get in Touch
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1]"
            >
              Contact <GradientText>Us</GradientText>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Have questions or want to partner with us? We'd love to hear from you.
            </motion.p>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="py-20 px-6 md:px-20 lg:px-32">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

            {/* ================= INFO SECTION ================= */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Let's Start a <br />
                  <GradientText>Conversation</GradientText>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Whether you're a restaurant owner looking to revolutionize your menu or a customer with feedback, we're here to help.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-slate-500 font-medium mb-1">{item.title}</div>
                          {item.link ? (
                            <a 
                              href={item.link}
                              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                            >
                              {item.content}
                            </a>
                          ) : (
                            <div className="text-slate-900 font-semibold">{item.content}</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Additional Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 border border-blue-100"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Quick Response
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We typically respond to all inquiries within 24 hours. For urgent matters, please mention "URGENT" in your message subject.
                </p>
              </motion.div>
            </motion.div>

            {/* ================= FORM SECTION ================= */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-slate-100 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-2 text-slate-900">Send a Message</h2>
              <p className="text-slate-500 text-sm mb-6">Fill out the form below and we'll get back to you soon.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tell us how we can help you..."
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* STATUS MESSAGE */}
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl text-sm font-medium ${
                      status.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {status.message}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all shadow-lg
                    ${
                      loading
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                    }
                    text-white
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 md:px-20 lg:px-32 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Transform Your <GradientText>Restaurant?</GradientText>
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Join hundreds of restaurants already using Dishpop to create immersive dining experiences.
              </p>
              <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                Get Started Today
              </button>
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
              <a href="/contact" className="hover:text-blue-600 transition-colors text-blue-600">
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
};

export default Contact;