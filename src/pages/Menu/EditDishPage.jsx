import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import menuApi from "../../api/menuApi";
import DishForm from "../../components/menu/DishForm";
import Sidebar from "../../components/Sidebar";

export default function EditDishPage() {
  const { username, id } = useParams();
  const navigate = useNavigate();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await menuApi.getDish(username, id);
        setDish(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dish:", error);
        setError("Failed to load dish");
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [username, id]);

  const handleSuccess = () => {
    navigate(`/${username}/dishes`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading dish...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dish) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-900 font-semibold mb-4">
              {error || "Dish not found"}
            </p>
            <button
              onClick={() => navigate(`/${username}/dishes`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
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
    </div>
  );
}