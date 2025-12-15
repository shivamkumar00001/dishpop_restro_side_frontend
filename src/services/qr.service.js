import QRCodeStyling from "qr-code-styling";

const generateQR = async (text) => {
  const qr = new QRCodeStyling({
    width: 350,
    height: 350,
    type: "png",
    data: text,

    // Neon Theme
    dotsOptions: {
      color: "#00eaff",
      type: "rounded"
    },

    backgroundOptions: {
      color: "#0d1117"
    },

    cornersSquareOptions: {
      color: "#00b4d8",
      type: "extra-rounded"
    },

    cornersDotOptions: {
      color: "#00eaff",
      type: "dot"
    },

    // LOGO (optional)
    // image: "/dinear-logo.png",
    // imageOptions: {
    //   imageSize: 0.25,
    //   hideBackgroundDots: true
    
  });

  const blob = await qr.getRawData("png");
  return URL.createObjectURL(blob);
};

export default { generateQR };
