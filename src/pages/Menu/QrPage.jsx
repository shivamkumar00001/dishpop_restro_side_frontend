import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, Copy, Printer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import qrService from "../../services/qr.service.js";

const QrPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [username, setUsername] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [copied, setCopied] = useState(false);

  /* =====================================================
     RESOLVE USERNAME (PARAM → PROFILE FALLBACK)
  ===================================================== */
  useEffect(() => {
    // 1️⃣ If username exists in URL
    if (params.username) {
      const Set = () =>{
      setUsername(params.username);
      }
      Set();
      return;
    }

    // 2️⃣ Fallback: fetch from logged-in profile
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setUsername(data.user.username);
      } catch (err) {
        console.error("Failed to resolve username:", err);
      }
    };

    fetchProfile();
  }, [params.username]);

  /* =====================================================
     GENERATE QR
  ===================================================== */
  useEffect(() => {
    if (!username) return;

    const qrLink = `http://localhost:5173/${username}`;
    qrService.generateQR(qrLink).then(setQrImage);
  }, [username]);

  const qrLink = username
    ? `http://localhost:5173/${username}`
    : "";

  /* =====================================================
     ACTIONS
  ===================================================== */
  const downloadQR = () => {
    if (!qrImage) return;
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `dinear-qr-${username}.png`;
    link.click();
  };

  const printQR = () => {
    if (!qrImage) return;
    const win = window.open("");
    win.document.write(`<img src="${qrImage}" style="width:300px;" />`);
    win.print();
    win.close();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(qrLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div
      className="min-h-screen p-6 flex flex-col items-center"
      style={{ backgroundColor: "#0C0F14" }}
    >
      {/* BACK */}
      <div className="w-full max-w-4xl mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1C222B] text-[#9AA0A6]
          hover:text-[#E6E9EF] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-4xl space-y-8">
        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold text-[#E6E9EF]">
            Restaurant QR Code
          </h1>
          <p className="text-sm text-[#9AA0A6]">
            Share this QR code with your customers
          </p>
        </div>

        {/* QR CARD */}
        <div className="mx-auto w-fit p-8 rounded-2xl bg-[#1A1F25]">
          <div className="space-y-6">
            {/* QR IMAGE */}
            <div className="mx-auto w-fit">
              {qrImage ? (
                <div className="p-6 bg-white rounded-xl">
                  <img src={qrImage} className="w-64 h-64" alt="QR Code" />
                </div>
              ) : (
                <div className="w-64 h-64 flex items-center justify-center rounded-xl bg-[#1C222B]">
                  <div className="text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-[#9AA0A6]">
                      Generating QR Code...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* LINK */}
            <div className="p-4 rounded-lg bg-[#11151C]">
              <p className="text-xs mb-1 text-[#9AA0A6]">Menu URL</p>
              <p className="text-xs font-mono text-[#E6E9EF] break-all">
                {qrLink}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={downloadQR}
                className="px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-400
                text-white flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                Download
              </button>

              <button
                onClick={printQR}
                className="px-4 py-3 rounded-lg bg-[#1C222B] hover:bg-[#2A313B]
                text-white flex items-center justify-center gap-2 transition"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>

              <button
                onClick={copyLink}
                className={`px-4 py-3 rounded-lg bg-[#1C222B]
                flex items-center justify-center gap-2 transition
                ${copied ? "text-green-400" : "text-white"}`}
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrPage;
