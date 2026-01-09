import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, Copy, Printer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import qrService from "../../services/qr.service.js";

const QrPage = () => {
  const navigate = useNavigate();
  const { username: paramUsername } = useParams();

  const [username, setUsername] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [copied, setCopied] = useState(false);

  /* ================= USERNAME ================= */
  useEffect(() => {
    if (paramUsername) {
      setUsername(paramUsername);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setUsername(data.user.username);
      } catch (err) {
        console.error("Failed to resolve username:", err);
      }
    };

    fetchProfile();
  }, [paramUsername]);

  /* ================= QR ================= */
  const qrLink = username
    ? `https://user.dishpop.in/${username}`
    : "";

  useEffect(() => {
    if (!username) return;
    qrService.generateQR(qrLink).then(setQrImage);
  }, [username]);

  /* ================= ACTIONS ================= */
  const downloadQR = () => {
    if (!qrImage) return;
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `dishpop-qr-${username}.png`;
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

  return (
    <div className="bg-black text-white min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-10 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* ================= LEFT INFO ================= */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold">
              Restaurant <span className="text-cyan-400">QR Code</span>
            </h1>

            <p className="text-gray-400 text-lg">
              Place this QR code on your tables or counter so customers can
              instantly view your digital menu.
            </p>

            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-sm text-gray-400 mb-1">Menu URL</p>
              <p className="text-sm font-mono break-all">{qrLink}</p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={downloadQR}
                className="flex items-center gap-2 px-5 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 font-semibold transition"
              >
                <Download size={16} />
                Download
              </button>

              <button
                onClick={printQR}
                className="flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
              >
                <Printer size={16} />
                Print
              </button>

              <button
                onClick={copyLink}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg border transition
                  ${
                    copied
                      ? "border-green-500 text-green-400"
                      : "border-gray-700 hover:border-cyan-400"
                  }
                `}
              >
                <Copy size={16} />
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>

          {/* ================= RIGHT CARD ================= */}
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Scan to View Menu
            </h2>

            <div className="flex justify-center">
              {qrImage ? (
                <div className="bg-white p-6 rounded-xl">
                  <img
                    src={qrImage}
                    alt="DishPop QR"
                    className="w-64 h-64"
                  />
                </div>
              ) : (
                <div className="w-64 h-64 flex flex-col items-center justify-center rounded-xl bg-black border border-gray-700">
                  <div className="w-8 h-8 border-2 border-t-transparent border-cyan-500 rounded-full animate-spin mb-3" />
                  <p className="text-sm text-gray-400">Generating QR...</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QrPage;
