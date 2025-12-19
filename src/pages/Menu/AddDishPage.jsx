import { useParams, useNavigate } from "react-router-dom";
import DishForm from "../../components/menu/DishForm";

export default function AddDishPage() {
  const { username } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Redirect to dish list after successful creation
    navigate(`/${username}/dishes`);
  };

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
          mode="add"
          username={username}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}