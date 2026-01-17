import QRCodeStyling from "qr-code-styling";

/**
 * Enterprise QR Generator (TEXT CENTER)
 * - Restaurant name in center
 * - Brand colors
 * - High error correction
 * - Print safe
 */
const generateQR = async ({
  text,
  centerText,
  size = 400,
  dotsColor = "#2563eb",
  bgColor = "#ffffff",
  cornerSquareColor = "#1e40af",
  cornerDotColor = "#2563eb",
}) => {
  const qr = new QRCodeStyling({
    width: size,
    height: size,
    type: "png",
    data: text,

    qrOptions: {
      errorCorrectionLevel: "H",
    },

    dotsOptions: {
      color: dotsColor,
      type: "rounded",
    },

    backgroundOptions: {
      color: bgColor,
    },

    cornersSquareOptions: {
      color: cornerSquareColor,
      type: "extra-rounded",
    },

    cornersDotOptions: {
      color: cornerDotColor,
      type: "dot",
    },
  });

  // Draw QR to canvas
  const blob = await qr.getRawData("png");
  const imageUrl = URL.createObjectURL(blob);

  // Create canvas to add text
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = size;
  canvas.height = size;

  const img = new Image();
  img.src = imageUrl;

  await new Promise((res) => (img.onload = res));
  ctx.drawImage(img, 0, 0, size, size);

  // Center text background
  const boxSize = size * 0.28;
  const x = (size - boxSize) / 2;
  const y = (size - boxSize) / 2;

  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, boxSize, boxSize);

  // Text
  ctx.fillStyle = dotsColor;
  ctx.font = `bold ${boxSize / 6}px Inter, Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    centerText?.toUpperCase() || "",
    size / 2,
    size / 2
  );

  return canvas.toDataURL("image/png");
};

export default { generateQR };
