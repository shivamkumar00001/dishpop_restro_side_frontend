import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { ArrowLeft, Save, Receipt } from "lucide-react";

export default function BillingEdit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    legalName: "",
    panNumber: "",
    gstNumber: "",
    address: "",
    state: "",
    pincode: "",
    taxType: "NO_GST",
    taxRate: 0,
  });

  /* ================= LOAD BILLING DETAILS ================= */
  useEffect(() => {
    const loadBilling = async () => {
      try {
        const res = await api.get("/billing/me");
        if (!res.data?.billingConfig) {
          toast.error("Billing not set up yet");
          navigate("/billing/setup");
          return;
        }

        setForm({
          legalName: res.data.billingConfig.legalName || "",
          panNumber: res.data.billingConfig.panNumber || "",
          gstNumber: res.data.billingConfig.gstNumber || "",
          address: res.data.billingConfig.address || "",
          state: res.data.billingConfig.state || "",
          pincode: res.data.billingConfig.pincode || "",
          taxType: res.data.billingConfig.taxType || "NO_GST",
          taxRate: res.data.billingConfig.taxRate || 0,
        });
      } catch {
        toast.error("Failed to load billing details");
        navigate("/settings");
      } finally {
        setLoading(false);
      }
    };

    loadBilling();
  }, [navigate]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put("/billing/me", {
        ...form,
        taxRate:
          form.taxType === "NO_GST" ? 0 : Number(form.taxRate),
      });

      toast.success("Billing details updated");
      navigate("/settings");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update billing"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading billing details…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-cyan-400 hover:text-cyan-300"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Receipt /> Edit Billing Details
          </h1>
        </div>

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10
          bg-white/[0.04] backdrop-blur-xl p-8"
        >
          <Input
            label="Legal Business Name"
            name="legalName"
            value={form.legalName}
            onChange={handleChange}
            required
          />

          <Input
            label="PAN Number"
            name="panNumber"
            value={form.panNumber}
            onChange={handleChange}
            required
          />

          <Input
            label="GST Number"
            name="gstNumber"
            value={form.gstNumber}
            onChange={handleChange}
            disabled={form.taxType === "NO_GST"}
          />

          <Input
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              required
            />
            <Input
              label="Pincode"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tax Type"
              name="taxType"
              value={form.taxType}
              onChange={handleChange}
            >
              <option value="NO_GST">No GST</option>
              <option value="CGST_SGST">CGST + SGST</option>
              <option value="IGST">IGST</option>
              <option value="INCLUSIVE_GST">Inclusive GST</option>
            </Select>

            <Input
              label="Tax Rate (%)"
              name="taxRate"
              type="number"
              value={form.taxRate}
              onChange={handleChange}
              disabled={form.taxType === "NO_GST"}
            />
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="flex justify-end gap-3 pt-4">
            <ActionButton
              type="button"
              label="Cancel"
              onClick={() => navigate("/settings")}
              variant="secondary"
            />
            <ActionButton
              type="submit"
              label={saving ? "Saving..." : "Save Changes"}
              icon={<Save size={16} />}
              disabled={saving}
              variant="primary"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= REUSABLE UI ================= */

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  disabled,
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full rounded-xl bg-black/40
        border border-white/10 px-4 py-3 text-sm
        focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-400">{label}</label>
      <select
        {...props}
        className="w-full rounded-xl bg-black/40
        border border-white/10 px-4 py-3 text-sm
        focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        {children}
      </select>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  type = "button",
  disabled,
  variant,
}) {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition";

  const styles = {
    primary:
      "bg-cyan-600 hover:bg-cyan-700 shadow shadow-cyan-500/25",
    secondary:
      "bg-white/10 hover:bg-white/20 text-gray-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
