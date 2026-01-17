// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import api from "../../services/api";

// import {
//   Building2,
//   MapPin,
//   FileText,
//   Receipt,
//   Save,
// } from "lucide-react";

// export default function BillingSetup() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     legalName: "",
//     gstNumber: "",
//     panNumber: "",
//     address: "",
//     state: "",
//     pincode: "",
//     taxType: "CGST_SGST",
//     taxRate: "",
//   });

//   /* ================= HANDLERS ================= */
//   const handleChange = (e) =>
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     try {
//     await api.post("/billing/setup", {
//   legalName: form.legalName,
//   gstNumber: form.taxType === "NO_GST" ? null : form.gstNumber,
//   panNumber: form.panNumber,
//   address: form.address,
//   state: form.state,
//   pincode: form.pincode,
//   taxType: form.taxType,
//   taxRate: form.taxType === "NO_GST" ? 0 : Number(form.taxRate),
// });


//       toast.success("Billing configuration saved");
//       navigate("/settings");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Billing setup failed");
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="min-h-screen bg-[#090B10] px-4 py-12 text-white">
//       <div className="mx-auto max-w-4xl space-y-10">

//         {/* Header */}
//         <header className="space-y-2">
//           <h1 className="text-4xl font-semibold tracking-tight">
//             Billing & Tax Setup
//           </h1>
//           <p className="text-gray-400">
//             Configure legal and tax settings for restaurant billing
//           </p>
//         </header>

//         {/* Card */}
//         <section className="rounded-2xl border border-white/10 bg-white/[0.04]
//         backdrop-blur-xl shadow-xl">

//           {/* Card Header */}
//           <div className="border-b border-white/10 px-8 py-6">
//             <p className="text-lg font-medium">
//               Business & Tax Configuration
//             </p>
//             <p className="text-sm text-gray-400">
//               Used for GST invoices and order billing
//             </p>
//           </div>

//           {/* Form */}
//           <form onSubmit={submitHandler} className="px-8 py-8 space-y-10">

//             {/* Business */}
//             <Section title="Business Information">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Field
//                   label="Legal Business Name"
//                   icon={<Building2 />}
//                   name="legalName"
//                   value={form.legalName}
//                   onChange={handleChange}
//                   required
//                 />
//                 <Field
//                   label="PAN Number"
//                   icon={<FileText />}
//                   name="panNumber"
//                   value={form.panNumber}
//                   onChange={handleChange}
//                   required
//                 />
//                 <Field
//                   label="GST Number"
//                   icon={<Receipt />}
//                   name="gstNumber"
//                   value={form.gstNumber}
//                   onChange={handleChange}
//                   disabled={form.taxType === "NO_GST"}
//                   required={form.taxType !== "NO_GST"}
//                 />
//               </div>
//             </Section>

//             {/* Address */}
//             <Section title="Address">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Field
//                   label="Address"
//                   icon={<MapPin />}
//                   name="address"
//                   value={form.address}
//                   onChange={handleChange}
//                   required
//                 />
//                 <Field
//                   label="State"
//                   icon={<MapPin />}
//                   name="state"
//                   value={form.state}
//                   onChange={handleChange}
//                   required
//                 />
//                 <Field
//                   label="Pincode"
//                   icon={<MapPin />}
//                   name="pincode"
//                   value={form.pincode}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </Section>

//             {/* Tax */}
//             <Section title="Tax Configuration">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                 {/* Tax Type */}
//                 <div className="space-y-2">
//                   <label className="text-sm text-gray-400">
//                     Tax Type
//                   </label>
//                   <select
//                     name="taxType"
//                     value={form.taxType}
//                     onChange={handleChange}
//                     className="w-full rounded-xl bg-white/[0.04]
//                     border border-white/10 px-4 py-3 text-white
//                     focus:border-cyan-500"
//                   >
//                     <option value="CGST_SGST" className="text-black">
//                       CGST + SGST (Same State)
//                     </option>
//                     <option value="IGST" className="text-black">
//                       IGST (Inter State)
//                     </option>
//                     <option value="INCLUSIVE_GST" className="text-black">
//                       GST Included in Price
//                     </option>
//                     <option value="NO_GST" className="text-black">
//                       No Tax
//                     </option>
//                   </select>
//                 </div>

//                 {/* Tax Rate */}
//                 <Field
//                   label="Tax Rate (%)"
//                   icon={<Receipt />}
//                   name="taxRate"
//                   type="number"
//                   step="0.1"
//                   value={form.taxRate}
//                   onChange={handleChange}
//                   disabled={form.taxType === "NO_GST"}
//                   required={form.taxType !== "NO_GST"}
//                 />
//               </div>
//             </Section>

//             {/* Save */}
//             <div className="flex justify-end pt-6 border-t border-white/10">
//               <button
//                 type="submit"
//                 className="flex items-center gap-2 rounded-xl
//                 bg-cyan-600 px-6 py-3 font-medium
//                 hover:bg-cyan-700 transition
//                 shadow-lg shadow-cyan-500/25"
//               >
//                 <Save size={18} />
//                 Save Billing
//               </button>
//             </div>

//           </form>
//         </section>
//       </div>
//     </div>
//   );
// }

// /* ================= REUSABLE ================= */

// function Section({ title, children }) {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-lg font-medium">{title}</h2>
//       {children}
//     </div>
//   );
// }

// function Field({ label, icon, ...props }) {
//   return (
//     <div className="space-y-2">
//       <label className="text-sm text-gray-400">{label}</label>
//       <div className="flex items-center gap-3 rounded-xl bg-white/[0.04]
//       border border-white/10 px-4 py-3 focus-within:border-cyan-500">
//         {icon}
//         <input
//           {...props}
//           className="flex-1 bg-transparent outline-none text-white"
//         />
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import api from "../../services/api";

import {
  Building2,
  MapPin,
  FileText,
  Receipt,
  Save,
  ArrowLeft,
  Shield,
  CheckCircle,
} from "lucide-react";

export default function BillingSetup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    legalName: "",
    gstNumber: "",
    panNumber: "",
    address: "",
    state: "",
    pincode: "",
    taxType: "CGST_SGST",
    taxRate: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/billing/setup", {
        legalName: form.legalName,
        gstNumber: form.taxType === "NO_GST" ? null : form.gstNumber,
        panNumber: form.panNumber,
        address: form.address,
        state: form.state,
        pincode: form.pincode,
        taxType: form.taxType,
        taxRate: form.taxType === "NO_GST" ? 0 : Number(form.taxRate),
      });

      toast.success("Billing configuration saved");
      navigate("/settings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Billing setup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-4 py-12">
      {/* Grain Texture */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="mx-auto max-w-4xl space-y-8 relative z-10">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Profile</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                Billing & Tax Setup
              </h1>
              <p className="text-slate-600 mt-1">
                Configure legal and tax settings for restaurant billing
              </p>
            </div>
          </div>
        </motion.header>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Required for Invoices & Orders
              </p>
              <p className="text-sm text-blue-700">
                This information will be used for generating GST-compliant
                invoices and processing customer orders.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Card Header */}
          <div className="border-b border-slate-200 px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <p className="text-lg font-bold text-slate-900">
              Business & Tax Configuration
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Used for GST invoices and order billing
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="px-8 py-8 space-y-10">

            {/* Business */}
            <Section title="Business Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Legal Business Name" icon={<Building2 />} name="legalName" value={form.legalName} onChange={handleChange} required />
                <Field label="PAN Number" icon={<FileText />} name="panNumber" value={form.panNumber} onChange={handleChange} placeholder="ABCDE1234F" required />
                <Field label="GST Number" icon={<Receipt />} name="gstNumber" value={form.gstNumber} onChange={handleChange} placeholder="22AAAAA0000A1Z5" disabled={form.taxType === "NO_GST"} required={form.taxType !== "NO_GST"} />
              </div>
            </Section>

            {/* Address */}
            <Section title="Address">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Address" icon={<MapPin />} name="address" value={form.address} onChange={handleChange} required />
                <Field label="State" icon={<MapPin />} name="state" value={form.state} onChange={handleChange} required />
                <Field label="Pincode" icon={<MapPin />} name="pincode" value={form.pincode} onChange={handleChange} required />
              </div>
            </Section>

            {/* Tax */}
            <Section title="Tax Configuration">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Tax Type</label>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                    <Receipt className="w-5 h-5 text-blue-600" />
                    <select name="taxType" value={form.taxType} onChange={handleChange} className="flex-1 bg-transparent outline-none">
                      <option value="CGST_SGST">CGST + SGST</option>
                      <option value="IGST">IGST</option>
                      <option value="INCLUSIVE_GST">GST Included</option>
                      <option value="NO_GST">No Tax</option>
                    </select>
                  </div>
                </div>

                <Field label="Tax Rate (%)" icon={<Receipt />} name="taxRate" type="number" step="0.1" value={form.taxRate} onChange={handleChange} disabled={form.taxType === "NO_GST"} required={form.taxType !== "NO_GST"} />
              </div>
            </Section>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
              <button type="button" onClick={() => navigate("/settings")} className="px-6 py-3 rounded-xl border bg-white">
                Cancel
              </button>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white"
              >
                <Save size={18} />
                {loading ? "Saving..." : "Save Billing"}
              </motion.button>
            </div>
          </form>
        </motion.section>
      </div>
    </div>
  );
}

/* ================= REUSABLE ================= */

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, icon, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className={`flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 ${props.disabled ? "opacity-50" : ""}`}>
        <span className="text-blue-600">{icon}</span>
        <input {...props} className="flex-1 bg-transparent outline-none" />
      </div>
    </div>
  );
}

