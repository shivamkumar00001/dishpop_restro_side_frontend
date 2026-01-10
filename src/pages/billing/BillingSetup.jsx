import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";

import {
  Building2,
  MapPin,
  FileText,
  Receipt,
  Save,
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

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submitHandler = async (e) => {
    e.preventDefault();

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
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#090B10] px-4 py-12 text-white">
      <div className="mx-auto max-w-4xl space-y-10">

        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">
            Billing & Tax Setup
          </h1>
          <p className="text-gray-400">
            Configure legal and tax settings for restaurant billing
          </p>
        </header>

        {/* Card */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04]
        backdrop-blur-xl shadow-xl">

          {/* Card Header */}
          <div className="border-b border-white/10 px-8 py-6">
            <p className="text-lg font-medium">
              Business & Tax Configuration
            </p>
            <p className="text-sm text-gray-400">
              Used for GST invoices and order billing
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="px-8 py-8 space-y-10">

            {/* Business */}
            <Section title="Business Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  label="Legal Business Name"
                  icon={<Building2 />}
                  name="legalName"
                  value={form.legalName}
                  onChange={handleChange}
                  required
                />
                <Field
                  label="PAN Number"
                  icon={<FileText />}
                  name="panNumber"
                  value={form.panNumber}
                  onChange={handleChange}
                  required
                />
                <Field
                  label="GST Number"
                  icon={<Receipt />}
                  name="gstNumber"
                  value={form.gstNumber}
                  onChange={handleChange}
                  disabled={form.taxType === "NO_GST"}
                  required={form.taxType !== "NO_GST"}
                />
              </div>
            </Section>

            {/* Address */}
            <Section title="Address">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  label="Address"
                  icon={<MapPin />}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
                <Field
                  label="State"
                  icon={<MapPin />}
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
                <Field
                  label="Pincode"
                  icon={<MapPin />}
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </Section>

            {/* Tax */}
            <Section title="Tax Configuration">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Tax Type */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">
                    Tax Type
                  </label>
                  <select
                    name="taxType"
                    value={form.taxType}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white/[0.04]
                    border border-white/10 px-4 py-3 text-white
                    focus:border-cyan-500"
                  >
                    <option value="CGST_SGST" className="text-black">
                      CGST + SGST (Same State)
                    </option>
                    <option value="IGST" className="text-black">
                      IGST (Inter State)
                    </option>
                    <option value="INCLUSIVE_GST" className="text-black">
                      GST Included in Price
                    </option>
                    <option value="NO_GST" className="text-black">
                      No Tax
                    </option>
                  </select>
                </div>

                {/* Tax Rate */}
                <Field
                  label="Tax Rate (%)"
                  icon={<Receipt />}
                  name="taxRate"
                  type="number"
                  step="0.1"
                  value={form.taxRate}
                  onChange={handleChange}
                  disabled={form.taxType === "NO_GST"}
                  required={form.taxType !== "NO_GST"}
                />
              </div>
            </Section>

            {/* Save */}
            <div className="flex justify-end pt-6 border-t border-white/10">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl
                bg-cyan-600 px-6 py-3 font-medium
                hover:bg-cyan-700 transition
                shadow-lg shadow-cyan-500/25"
              >
                <Save size={18} />
                Save Billing
              </button>
            </div>

          </form>
        </section>
      </div>
    </div>
  );
}

/* ================= REUSABLE ================= */

function Section({ title, children }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, icon, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <div className="flex items-center gap-3 rounded-xl bg-white/[0.04]
      border border-white/10 px-4 py-3 focus-within:border-cyan-500">
        {icon}
        <input
          {...props}
          className="flex-1 bg-transparent outline-none text-white"
        />
      </div>
    </div>
  );
}
