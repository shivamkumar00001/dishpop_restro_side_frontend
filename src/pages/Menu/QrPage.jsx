import { useEffect, useState } from "react";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import qrService from "../../services/qr.service";

export default function QrPage() {
  const navigate = useNavigate();
  const { username: paramUsername } = useParams();

  const [username, setUsername] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [qrImage, setQrImage] = useState(null);
  const [generating, setGenerating] = useState(false);

  const [qrColor, setQrColor] = useState("#2563eb");
  const [bgColor, setBgColor] = useState("#ffffff");

  /* ================= USER ================= */
  useEffect(() => {
    if (paramUsername) {
      setUsername(paramUsername);
      setRestaurantName(paramUsername);
      return;
    }

    const loadProfile = async () => {
      const { data } = await api.get("/auth/profile");
      setUsername(data.user.username);
      setRestaurantName(
        data.user.restaurantName || data.user.username
      );
    };

    loadProfile();
  }, [paramUsername]);

  const qrLink = username
    ? `https://user.dishpop.in/${username}`
    : "";

  /* ================= QR ================= */
  useEffect(() => {
    if (!qrLink) return;

    setGenerating(true);

    qrService
      .generateQR({
        text: qrLink,
        centerText: restaurantName,
        dotsColor: qrColor,
        bgColor,
        cornerSquareColor: qrColor,
        cornerDotColor: qrColor,
      })
      .then((img) => {
        setQrImage(img);
        setTimeout(() => setGenerating(false), 300); // smooth UX
      });
  }, [qrLink, restaurantName, qrColor, bgColor]);

  /* ================= ACTIONS ================= */
  const downloadQR = () => {
    const a = document.createElement("a");
    a.href = qrImage;
    a.download = `dishpop-qr-${username}.png`;
    a.click();
  };

  const printQR = () => {
    const win = window.open("");
    win.document.write(`<img src="${qrImage}" style="width:320px"/>`);
    win.print();
    win.close();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div>
          <h1 className="text-xl font-bold text-gray-900">
            QR Code Settings
          </h1>
          <p className="text-xs text-gray-500">
            Customize your restaurant QR
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-8">
        {/* LEFT PANEL */}
        <div className="bg-white border rounded-xl p-6 space-y-6 transition hover:shadow-md">
          <h2 className="font-semibold text-gray-900">
            Branding
          </h2>

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-600">
              Restaurant Name
            </label>
            <input
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:outline-none
                transition"
              placeholder="Enter restaurant name"
            />
          </div>

          {/* COLORS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">
                QR Color
              </label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <span className="text-xs text-gray-500">
                  {qrColor}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Background
              </label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <span className="text-xs text-gray-500">
                  {bgColor}
                </span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={downloadQR}
              disabled={!qrImage}
              className="flex items-center gap-2 px-4 py-2
                bg-blue-600 text-white rounded-lg
                hover:bg-blue-700 active:scale-95
                disabled:opacity-50 transition"
            >
              <Download size={16} />
              Download
            </button>

            <button
              onClick={printQR}
              disabled={!qrImage}
              className="flex items-center gap-2 px-4 py-2
                bg-gray-800 text-white rounded-lg
                hover:bg-gray-900 active:scale-95
                disabled:opacity-50 transition"
            >
              <Printer size={16} />
              Print
            </button>
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="bg-white border rounded-xl p-6 flex flex-col items-center transition hover:shadow-md">
          <h2 className="font-semibold text-gray-900 mb-4">
            Live Preview
          </h2>

          {/* QR CONTAINER */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {generating && (
              <div className="absolute inset-0 rounded-xl
                bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100
                animate-pulse"
              />
            )}

            {qrImage && (
              <img
                src={qrImage}
                alt="DishPop QR"
                className={`w-64 h-64 rounded-xl
                  transition-transform duration-300
                  ${generating ? "scale-95" : "scale-100"}`}
              />
            )}
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center break-all">
            {qrLink}
          </p>
        </div>
      </div>
    </div>
  );
}
