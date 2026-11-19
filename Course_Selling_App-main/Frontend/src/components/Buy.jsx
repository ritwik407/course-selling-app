import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Buy = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const handlePurchase = async () => {
    if (!token) {
      toast.error("Please login to purchase the course");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/course/buy/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Course purchased successfully");
      navigate("/purchases");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        "Error in buying course";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <Toaster />
        <button
          className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-blue-800 duration-300 disabled:opacity-60"
          onClick={handlePurchase}
          disabled={loading}
        >
          {loading ? "Processing..." : "Buy Now"}
        </button>
      </div>
    </div>
  );
};

export default Buy;

