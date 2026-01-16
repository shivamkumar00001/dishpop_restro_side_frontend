import React, { useEffect, useState } from "react";
import {
  Download,
  FileText,
  TrendingUp,
  RefreshCw,
  IndianRupee,
} from "lucide-react";

import {
  fetchAuditLogs,
  fetchGSTSummary,
  exportToExcel,
} from "../../api/gstAuditApi";

const GSTAuditPage = () => {
  const username = localStorage.getItem("username") || "demo";

  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    gstType: "",
    paymentMethod: "",
    status: "FINALIZED",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadLogs();
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  /* ===========================
     API CALLS (SERVICE BASED)
  ============================ */

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await fetchAuditLogs(username, {
        ...filters,
        page,
        limit: 50,
      });

      if (res?.success) {
        setLogs(res.data || []);
        setTotalPages(res.pages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch GST logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const res = await fetchGSTSummary(
        username,
        filters.startDate,
        filters.endDate
      );

      if (res?.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch GST summary:", err);
    }
  };

  const handleExport = async () => {
    try {
      await exportToExcel(
        username,
        filters.startDate,
        filters.endDate,
        filters.gstType
      );
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  /* ===========================
     HELPERS
  ============================ */

  const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  /* ===========================
     UI
  ============================ */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">GST Audit Log</h1>
          <p className="text-sm text-gray-600">
            Tax compliance & reporting for CA audit
          </p>
        </div>

        {/* Summary */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              label="Total Bills"
              value={summary.totals.totalBills}
              icon={<FileText className="w-4 h-4 text-blue-600" />}
            />
            <SummaryCard
              label="Total Sales"
              value={formatCurrency(summary.totals.totalSales)}
              icon={<TrendingUp className="w-4 h-4 text-green-600" />}
            />
            <SummaryCard
              label="Taxable Amount"
              value={formatCurrency(summary.totals.totalTaxableAmount)}
              icon={<IndianRupee className="w-4 h-4 text-orange-600" />}
            />
            <SummaryCard
              label="Total GST"
              value={formatCurrency(summary.totals.totalGST)}
              icon={<IndianRupee className="w-4 h-4 text-red-600" />}
              subText={`CGST ${formatCurrency(
                summary.totals.totalCGST
              )} | SGST ${formatCurrency(
                summary.totals.totalSGST
              )} | IGST ${formatCurrency(summary.totals.totalIGST)}`}
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(v) => setFilters({ ...filters, startDate: v })}
          />
          <Input
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(v) => setFilters({ ...filters, endDate: v })}
          />

          <Select
            label="GST Type"
            value={filters.gstType}
            onChange={(v) => setFilters({ ...filters, gstType: v })}
            options={[
              { label: "All", value: "" },
              { label: "CGST + SGST", value: "CGST_SGST" },
              { label: "IGST", value: "IGST" },
              { label: "No GST", value: "NO_GST" },
            ]}
          />

          <Select
            label="Payment"
            value={filters.paymentMethod}
            onChange={(v) => setFilters({ ...filters, paymentMethod: v })}
            options={[
              { label: "All", value: "" },
              { label: "Cash", value: "CASH" },
              { label: "Card", value: "CARD" },
              { label: "UPI", value: "UPI" },
            ]}
          />

          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                loadLogs();
                loadSummary();
              }}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Date",
                  "Bill #",
                  "Customer",
                  "Table",
                  "Subtotal",
                  "Discount",
                  "Taxable",
                  "GST Type",
                  "CGST",
                  "SGST",
                  "IGST",
                  "Total GST",
                  "Grand Total",
                  "Payment",
                ].map((h) => (
                  <th key={h} className="px-3 py-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="14" className="text-center py-8">
                    Loading...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="14" className="text-center py-8">
                    No records found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="border-t">
                    <td className="px-3 py-2">
                      {new Date(log.billedAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 font-medium">
                      {log.billNumber}
                    </td>
                    <td className="px-3 py-2">{log.customerName}</td>
                    <td className="px-3 py-2">{log.tableNumber}</td>
                    <td className="px-3 py-2 text-right">
                      {formatCurrency(log.subtotal)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatCurrency(log.discount)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatCurrency(log.taxableAmount)}
                    </td>
                    <td className="px-3 py-2">{log.gstType}</td>
                    <td className="px-3 py-2 text-right">
                      {formatCurrency(log.cgstAmount)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatCurrency(log.sgstAmount)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatCurrency(log.igstAmount)}
                    </td>
                    <td className="px-3 py-2 text-right text-red-600">
                      {formatCurrency(log.totalGST)}
                    </td>
                    <td className="px-3 py-2 text-right font-bold">
                      {formatCurrency(log.grandTotal)}
                    </td>
                    <td className="px-3 py-2">{log.paymentMethod}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ===========================
   SMALL UI COMPONENTS
=========================== */

const SummaryCard = ({ label, value, icon, subText }) => (
  <div className="bg-white p-4 rounded-lg border">
    <div className="flex justify-between items-center mb-1">
      <p className="text-xs text-gray-600">{label}</p>
      {icon}
    </div>
    <p className="text-xl font-bold">{value}</p>
    {subText && <p className="text-xs text-gray-500 mt-1">{subText}</p>}
  </div>
);

const Input = ({ label, type, value, onChange }) => (
  <div>
    <label className="text-xs text-gray-600">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border px-2 py-2 rounded text-sm"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-xs text-gray-600">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border px-2 py-2 rounded text-sm"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

export default GSTAuditPage;
