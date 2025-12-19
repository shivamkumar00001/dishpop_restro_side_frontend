import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import menuApi from "../../api/menuApi";
import DishForm from "../../components/menu/DishForm";

export default function EditDishPage() {
  const { username, id } = useParams();
  const navigate = useNavigate();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await menuApi.getDish(username, id);
        setDish(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dish:", error);
        alert("Failed to load dish");
        navigate(`/${username}/menu`);
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [username, id, navigate]);

  const handleSuccess = () => {
    navigate(`/${username}/menu`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B10] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-white mt-4">Loading dish...</p>
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="min-h-screen bg-[#080B10] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Dish not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B10] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back to Menu
        </button>

        {/* Form */}
        <DishForm
          mode="edit"
          initial={dish}
          username={username}
          dishId={id}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}