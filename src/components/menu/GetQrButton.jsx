import React from "react";
import { QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GetQRButton = ({ restaurantId }) => {
  const navigate = useNavigate();

  const openQRPage = () => {
    navigate(`/qr/${restaurantId}`);
  };

  return (
    <button
      onClick={openQRPage}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 shadow-md transition-all"
    >
      <QrCode className="w-5 h-5" />
      Get QR Code
    </button>
  );
};

export default GetQRButton;
