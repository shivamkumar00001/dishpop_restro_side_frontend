import React, { useState } from "react";
import { Mail, MapPin, Loader2 } from "lucide-react";
import api from "../../services/api"; // 👈 axios instance

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

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

  return (
    <div className="bg-black text-white min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

        {/* ================= INFO SECTION ================= */}
        <div className="space-y-6">
          <h1 className="text-5xl font-bold">
            Contact <span className="text-cyan-400">Us</span>
          </h1>

          <p className="text-gray-400 text-lg">
            Have questions or want to partner with us?  
            We’d love to hear from you.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="text-cyan-400" />
              <span>dishpopofficial@gmail.com</span>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="text-cyan-400" />
              <span>India</span>
            </div>
          </div>
        </div>

        {/* ================= FORM SECTION ================= */}
        <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500"
            />

            {/* STATUS MESSAGE */}
            {status.message && (
              <p
                className={`text-sm ${
                  status.type === "success"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all
                ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-cyan-500 hover:bg-cyan-600"
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
