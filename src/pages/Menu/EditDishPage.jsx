// src/pages/Menu/EditDishPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/AxiosClient";

import DishForm from "../../components/menu/EditDishForm";

export default function EditDishPage() {
  const { username, id } = useParams();
  const navigate = useNavigate();

  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);

      try {
        const res = await axiosClient.get(
          `/restaurants/${username}/dishes/${id}`
        );

        const data = res.data?.data ?? res.data;

        if (!cancelled) setInitial(data);
      } catch (err) {
        console.error("Failed to load dish", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [username, id]);

  if (loading) {
    return <div className="p-6 text-white">Loading dish...</div>;
  }

  if (!initial) {
    return <div className="p-6 text-white">Dish not found</div>;
  }

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Dish</h1>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
          <DishForm
            mode="edit"
            initial={initial}

            // ✅ FIXED: correct prop name
            restaurantId={username}

            dishId={id}
            autosaveKey={`draft:restaurant:${username}:dish:${id}`}
            onSuccess={() => navigate(-1)}
          />
        </div>
      </div>
    </div>
  );
}
