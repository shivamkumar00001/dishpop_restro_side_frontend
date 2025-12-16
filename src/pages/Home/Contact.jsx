import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Later connect to backend / email service
    alert("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-black text-white min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

        {/* Info Section */}
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
              <span>dinearofficial@gmail.com</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="text-cyan-400" />
              <span>+91 XXXXX XXXXX</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-cyan-400" />
              <span>India</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
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

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
