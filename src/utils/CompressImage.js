// src/utils/compressImage.js
/**
 * compressImage(file, { maxWidth = 1600, maxHeight = 1600, quality = 0.8 })
 * returns Promise<File>
 */
export async function compressImage(file, { maxWidth = 1600, maxHeight = 1600, quality = 0.8 } = {}) {
  if (!file || !file.type.startsWith("image/")) return file;

  const img = await new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      res(image);
    };
    image.onerror = (e) => rej(e);
    image.src = url;
  });

  const { width, height } = img;
  let targetW = width;
  let targetH = height;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    targetW = Math.round(width * ratio);
    targetH = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, targetW, targetH);

  // prefer webp if browser supports
  const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
  const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: mime });

  return compressedFile;
}
