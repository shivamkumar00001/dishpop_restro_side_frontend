import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Download,
  FileText,
  TrendingUp,
  RefreshCw,
  IndianRupee,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  fetchAuditLogs,
  fetchGSTSummary,
  exportToExcel,
} from "../../api/gstAuditApi";

const GSTAuditPage = () => {
  const username = useMemo(() => localStorage.getItem("username") || "demo", []);

  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      startDate: firstDay.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
      gstType: "",
      paymentMethod: "",
      status: "FINALIZED",
    };
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 50;

  // Memoized date range for display
  const dateRangeText = useMemo(() => {
    if (!filters.startDate || !filters.endDate) return "";
    const start = new Date(filters.startDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const end = new Date(filters.endDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${start} - ${end}`;
  }, [filters.startDate, filters.endDate]);

  // Load logs with debouncing effect
  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAuditLogs(username, {
        ...filters,
        page,
        limit,
      });

      if (res?.success) {
        setLogs(res.data || []);
        setTotalPages(res.pages || 1);
        setTotalRecords(res.total || 0);
      } else {
        throw new Error("Failed to fetch audit logs");
      }
    } catch (err) {
      console.error("Failed to fetch GST logs:", err);
      setError("Unable to load transaction data. Please try again.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [username, filters, page, limit]);

  // Load summary with optimized calculation
  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    setError(null);
    try {
      const res = await fetchGSTSummary(
        username,
        filters.startDate,
        filters.endDate
      );

      if (res?.success && res?.data) {
        // Recalculate totals from breakdown for accuracy
        let calculatedTotals;
        
        if (res.data.breakdown && Array.isArray(res.data.breakdown) && res.data.breakdown.length > 0) {
          calculatedTotals = res.data.breakdown.reduce(
            (acc, curr) => ({
              totalBills: acc.totalBills + (parseInt(curr.totalBills) || 0),
              totalSales: acc.totalSales + (parseFloat(curr.totalSales) || 0),
              totalTaxableAmount: acc.totalTaxableAmount + (parseFloat(curr.totalTaxableAmount) || 0),
              totalCGST: acc.totalCGST + (parseFloat(curr.totalCGST) || 0),
              totalSGST: acc.totalSGST + (parseFloat(curr.totalSGST) || 0),
              totalIGST: acc.totalIGST + (parseFloat(curr.totalIGST) || 0),
              totalGST: acc.totalGST + (parseFloat(curr.totalGST) || 0),
            }),
            {
              totalBills: 0,
              totalSales: 0,
              totalTaxableAmount: 0,
              totalCGST: 0,
              totalSGST: 0,
              totalIGST: 0,
              totalGST: 0,
            }
          );
        } else {
          // Fallback to backend totals if breakdown is empty
          calculatedTotals = res.data.totals || {
            totalBills: 0,
            totalSales: 0,
            totalTaxableAmount: 0,
            totalCGST: 0,
            totalSGST: 0,
            totalIGST: 0,
            totalGST: 0,
          };
        }

        setSummary({
          breakdown: res.data.breakdown || [],
          totals: calculatedTotals,
        });
      } else {
        throw new Error("Invalid summary data received");
      }
    } catch (err) {
      console.error("Failed to fetch GST summary:", err);
      setError("Unable to load summary data. Please try again.");
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, [username, filters.startDate, filters.endDate]);

  // Handle export with loading state
  const handleExport = useCallback(async () => {
    if (exporting) return;
    
    setExporting(true);
    try {
      await exportToExcel(
        username,
        filters.startDate,
        filters.endDate,
        filters.gstType
      );
    } catch (err) {
      console.error("Export failed:", err);
      setError("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [username, filters.startDate, filters.endDate, filters.gstType, exporting]);

  // Refresh both logs and summary
  const handleRefresh = useCallback(() => {
    loadLogs();
    loadSummary();
  }, [loadLogs, loadSummary]);

  // Update filter
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  }, []);

  // Pagination handlers
  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  // Initial load
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  // Memoized currency formatter
  const formatCurrency = useCallback((amount = 0) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  // Memoized date formatter
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600" />
            GST Audit Log
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Tax compliance & reporting for CA audit • {dateRangeText}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Summary Cards */}
        {summaryLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg border animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              label="Total Bills"
              value={summary.totals.totalBills.toLocaleString("en-IN")}
              icon={<FileText className="w-4 h-4 text-blue-600" />}
              trend={`${totalRecords} records in view`}
            />
            <SummaryCard
              label="Total Revenue"
              value={formatCurrency(summary.totals.totalSales)}
              icon={<TrendingUp className="w-4 h-4 text-green-600" />}
              trend={`Avg bill: ${formatCurrency(summary.totals.totalSales / (summary.totals.totalBills || 1))}`}
            />
            <SummaryCard
              label="Taxable Amount"
              value={formatCurrency(summary.totals.totalTaxableAmount)}
              icon={<IndianRupee className="w-4 h-4 text-orange-600" />}
              trend={`Before GST addition`}
            />
            <SummaryCard
              label="Total GST Collected"
              value={formatCurrency(summary.totals.totalGST)}
              icon={<IndianRupee className="w-4 h-4 text-red-600" />}
              subText={`CGST ${formatCurrency(summary.totals.totalCGST)} | SGST ${formatCurrency(summary.totals.totalSGST)} | IGST ${formatCurrency(summary.totals.totalIGST)}`}
              trend={`${((summary.totals.totalGST / summary.totals.totalTaxableAmount) * 100 || 0).toFixed(1)}% tax rate`}
            />
          </div>
        ) : null}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={(v) => updateFilter("startDate", v)}
            />
            <Input
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={(v) => updateFilter("endDate", v)}
            />

            <Select
              label="GST Type"
              value={filters.gstType}
              onChange={(v) => updateFilter("gstType", v)}
              options={[
                { label: "All Types", value: "" },
                { label: "CGST + SGST", value: "CGST_SGST" },
                { label: "IGST", value: "IGST" },
                { label: "No GST", value: "NO_GST" },
              ]}
            />

            <Select
              label="Payment Method"
              value={filters.paymentMethod}
              onChange={(v) => updateFilter("paymentMethod", v)}
              options={[
                { label: "All Methods", value: "" },
                { label: "Cash", value: "CASH" },
                { label: "Card", value: "CARD" },
                { label: "UPI", value: "UPI" },
              ]}
            />

            <div className="flex items-end gap-2">
              <button
                onClick={handleRefresh}
                disabled={loading || summaryLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading || summaryLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                disabled={exporting || logs.length === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
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
                    <th key={h} className="px-3 py-3 text-left font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="14" className="text-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                      <p className="text-sm text-gray-600 mt-2">Loading transactions...</p>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="14" className="text-center py-12">
                      <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">No records found</p>
                      <p className="text-xs text-gray-500 mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log, idx) => (
                    <tr
                      key={log._id}
                      className={`border-t hover:bg-blue-50 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-3 py-3 whitespace-nowrap">
                        {formatDate(log.billedAt)}
                      </td>
                      <td className="px-3 py-3 font-semibold text-blue-700">
                        {log.billNumber}
                      </td>
                      <td className="px-3 py-3">{log.customerName || "Walk-in"}</td>
                      <td className="px-3 py-3 text-center">{log.tableNumber || "-"}</td>
                      <td className="px-3 py-3 text-right font-medium">
                        {formatCurrency(log.subtotal)}
                      </td>
                      <td className="px-3 py-3 text-right text-orange-600">
                        {log.discount > 0 ? formatCurrency(log.discount) : "-"}
                      </td>
                      <td className="px-3 py-3 text-right font-medium">
                        {formatCurrency(log.taxableAmount)}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          log.gstType === "CGST_SGST" ? "bg-blue-100 text-blue-700" :
                          log.gstType === "IGST" ? "bg-purple-100 text-purple-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {log.gstType}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        {log.cgstAmount > 0 ? formatCurrency(log.cgstAmount) : "-"}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {log.sgstAmount > 0 ? formatCurrency(log.sgstAmount) : "-"}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {log.igstAmount > 0 ? formatCurrency(log.igstAmount) : "-"}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-red-600">
                        {formatCurrency(log.totalGST)}
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-green-700">
                        {formatCurrency(log.grandTotal)}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          log.paymentMethod === "CASH" ? "bg-green-100 text-green-700" :
                          log.paymentMethod === "CARD" ? "bg-blue-100 text-blue-700" :
                          log.paymentMethod === "UPI" ? "bg-purple-100 text-purple-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {log.paymentMethod}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t bg-gray-50 px-4 py-3 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalRecords)} of {totalRecords} records
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===========================
   OPTIMIZED UI COMPONENTS
=========================== */

const SummaryCard = React.memo(({ label, value, icon, subText, trend }) => (
  <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center mb-2">
      <p className="text-xs font-medium text-gray-600">{label}</p>
      {icon}
    </div>
    <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
    {trend && <p className="text-xs text-gray-500">{trend}</p>}
    {subText && <p className="text-xs text-gray-500 mt-2 pt-2 border-t">{subText}</p>}
  </div>
));

const Input = React.memo(({ label, type, value, onChange }) => (
  <div>
    <label className="text-xs font-medium text-gray-700 mb-1 block">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    />
  </div>
));

const Select = React.memo(({ label, value, onChange, options }) => (
  <div>
    <label className="text-xs font-medium text-gray-700 mb-1 block">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
));

export default GSTAuditPage;