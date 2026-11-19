import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";


const Purchases = () => {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const token = user?.token;
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!token) {
        toast.error("Please login to view your purchases");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/purchases`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setCourseData(data?.courseData || []);
      } catch (error) {
        const msg =
          error?.response?.data?.message ||
          error?.response?.data?.errors ||
          "Error fetching purchases";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Your Purchases</h1>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : courseData.length === 0 ? (
          <p className="text-gray-400">No purchased courses yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courseData.map((course) => (
              <div
                key={course._id}
                className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800"
              >
                <img
                  src={course?.image?.url}
                  alt={course?.title}
                  className="h-36 w-full object-contain bg-black"
                />
                <div className="p-4">
                  <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                  <p className="text-gray-300 text-sm mb-4">
                    {course.description?.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                  <div className="text-orange-400 font-semibold">₹{course.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchases;

