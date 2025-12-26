import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function ARModelRequest() {
  // ✅ dishId from route
  const { dishId } = useParams();

  const [dishName, setDishName] = useState("");
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ backend requirement
    if (!dishId) {
      setError("Dish ID missing in URL");
      return;
    }

    if (!dishName || files.length === 0) {
      setError("Dish name and image folder are required");
      return;
    }

    const formData = new FormData();
    formData.append("dishId", dishId); // ✅ REQUIRED
    formData.append("dishName", dishName);
    files.forEach((file) => formData.append("files", file));

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/ar/request-model`,
        formData,
        { withCredentials: true }
      );

      setImages(res.data.images);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-xl">
        {!success ? (
          <>
            {/* HEADER */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-white">
                Upload Dish Images
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Upload a folder of dish images to generate an AR model
              </p>

              {/* ✅ Optional clarity */}
              <p className="text-xs text-gray-500 mt-2">
                Dish ID: <span className="text-gray-300">{dishId}</span>
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Dish Name */}
              <div>
                <label className="text-sm text-gray-300">Dish Name</label>
                <input
                  type="text"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="e.g. Paneer Tikka"
                  className="mt-1 w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              {/* Folder Upload */}
              <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-zinc-700 rounded-xl py-8 cursor-pointer hover:border-cyan-500 transition">
                <UploadCloud className="text-cyan-400" size={28} />
                <p className="text-sm text-gray-300">
                  {files.length > 0
                    ? `${files.length} images selected`
                    : "Select image folder"}
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG, WEBP only
                </p>

                <input
                  type="file"
                  accept="image/*"
                  webkitdirectory="true"
                  multiple
                  className="hidden"
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  required
                />
              </label>

              {/* ERROR */}
              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 rounded-lg py-3 font-medium transition
                ${
                  loading
                    ? "bg-zinc-700 cursor-not-allowed"
                    : "bg-cyan-500 hover:bg-cyan-600 text-black"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Uploading...
                  </>
                ) : (
                  "Upload Images"
                )}
              </button>
            </form>
          </>
        ) : (
          /* SUCCESS STATE */
          <div className="text-center space-y-5">
            <CheckCircle size={48} className="mx-auto text-green-400" />
            <h2 className="text-xl font-semibold text-white">
              Images Uploaded Successfully
            </h2>
            <p className="text-sm text-gray-400">
              Dishpop team has received images for <b>{dishName}</b>
            </p>

            {/* IMAGE PREVIEW */}
            {/* <div className="grid grid-cols-3 gap-3 mt-4">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative group border border-zinc-700 rounded-lg overflow-hidden"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.dishName}
                    className="h-24 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <ImageIcon className="text-white" size={18} />
                  </div>
                </div>
              ))}
            </div> */}

            <button
              onClick={() => window.location.reload()}
              className="text-sm text-cyan-400 hover:underline"
            >
              Upload another dish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
