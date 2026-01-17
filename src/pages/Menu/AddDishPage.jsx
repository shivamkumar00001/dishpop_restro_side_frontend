import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DishForm from "../../components/menu/DishForm";
import Sidebar from "../../components/Sidebar";

export default function AddDishPage() {
  const { username } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(`/${username}/dishes`);
  };

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
            mode="add"
            username={username}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}