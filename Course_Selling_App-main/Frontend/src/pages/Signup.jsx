import React, { useState } from "react";
import logo from "/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/signup`, {
        firstName, lastName, email, password
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log("Signup successful: ", response.data);
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Signup failed!!!");
      } else {
        toast.error("An unexpected error occurred.");
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };
  return (
    <div className="bg-linear-to-r from-black to-blue-950 ">
      <div className="h-screen container mx-auto flex  items-center justify-center text-white">
        <div><Toaster /></div>
        {/* Header */}
        <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3 sm:px-6 sm:py-5">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />

            <Link to="/" className="text-lg sm:text-xl font-bold text-orange-500">
              CourseHaven
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/login"
              className="border border-gray-500 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-base rounded-md"
            >
              Login
            </Link>

            <Link
              to="/courses"
              className="bg-orange-500 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-base rounded-md"
            >
              Join now
            </Link>
          </div>
        </header>

        {/* Signup Form */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-125 m-8 md:m-0 mt-0">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Welcome to <span className="text-orange-500">CourseHaven</span>
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Just Signup To Join Us!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="firstname" className=" text-gray-400 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your firstname"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastname" className=" text-gray-400 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                }}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your lastname"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className=" text-gray-400 mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@email.com"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className=" text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  required
                />
                <span className="absolute right-3 top-3 text-gray-500 cursor-pointer">
                  👁️
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md transition"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;