import { Link } from "react-router-dom"
import logo from "/logo.png"
import { FaFacebook, FaTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import axios from "axios"
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast, { Toaster } from "react-hot-toast";
const Home = () => {
  const [courses, setCourses] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const responses = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/course/allcourses`, { withCredentials: true });
        setCourses(responses.data.courses)
      } catch (error) {
        console.log("Error fetching courses", error);
      }
    }
    fetchCourses()
  }, [])

  const handleLogOut = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/logout`, { withCredentials: true })
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      toast.success(response.data.message || "Logged out successfully")
    } catch (error) {
      console.log("Error logging out", error);
    }
  }
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  

  return (
    <div className='bg-linear-to-r from-gray-900 to-blue-950'>
      <div className='h-[1250px] md:h-[1050px] text-white container mx-auto '>
        {/*Header part */}
        <div><Toaster /></div>
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:p-6">
  <div className="flex items-center gap-3">
    <img
      src={logo}
      alt="course logo"
      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full"
    />

    <h1 className="font-bold text-xl sm:text-2xl text-orange-500">
      CourseHeaven
    </h1>
  </div>

  <div className="flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
    {isLoggedIn ? (
      <button
        onClick={handleLogOut}
        className="px-4 py-2 border rounded hover:border-amber-500 hover:text-amber-500"
      >
        Logout
      </button>
    ) : (
      <>
        <Link
          to="/login"
          className="px-4 py-2 border rounded hover:border-amber-500 hover:text-amber-500"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="px-4 py-2 border rounded hover:border-amber-500 hover:text-amber-500"
        >
          Sign-up
        </Link>
      </>
    )}
  </div>
</header>

        {/* Section part */}
        <section className="flex flex-col items-center gap-6 pt-12 px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-500">
            CourseHeaven
          </h1>

          <h2 className="text-sm sm:text-base text-gray-400 font-semibold max-w-2xl">
            Sharpen your skills with courses crafted by experts.
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/courses"
              className="px-6 py-3 bg-[#22C55E] hover:text-gray-800 hover:bg-white rounded-md font-bold text-center"
            >
              Explore Courses
            </Link>

            <Link
              to="#"
              className="px-6 py-3 bg-white hover:text-white hover:bg-[#22C55E] text-gray-800 rounded-md font-bold text-center"
            >
              Course Videos
            </Link>
          </div>
        </section>
        <section className="p-10">
          <Slider className="" {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="p-4">
                <div className="relative shrink-0 transition-transform duration-300 transform hover:scale-105">
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      className="h-32 w-full object-contain"
                      src={course.image.url}
                      alt=""
                    />
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-white">
                        {course.title}
                      </h2>
                      <Link
                        to={`/buy/${course._id}`}
                        className="mt-4 inline-block bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>
        <hr />
        {/*Footer part */}
        <footer className="my-5">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2">
                <img src={logo} alt="" className="w-10 h-10 rounded-full" />
                <h1 className="text-2xl text-orange-500 font-bold">
                  CourseHaven
                </h1>
              </div>
              <div className="mt-3 ml-2 md:ml-8">
                <p className="mb-2">Follow us</p>
                <div className="flex space-x-4">
                  <a href="#">
                    <FaFacebook className="text-2xl hover:text-blue-400 duration-300" />
                  </a>
                  <a href="https://www.instagram.com/myself.ritwik.kundu" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="text-2xl hover:text-pink-600 duration-300" />
                  </a>
                  <a href="#">
                    <FaTwitter className="text-2xl hover:text-blue-600 duration-300" />
                  </a>
                </div>
              </div>
            </div>

            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold md:mb-4">connects</h3>
              <ul className=" space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  <a
                    href="https://www.instagram.com/myself.ritwik.kundu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    instagram- myself.ritwik.kundu
                  </a>
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  <a
                    href="https://github.com/ritwik407"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Github- ritwik407
                  </a>
                </li>
              </ul>
            </div>
            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold mb-4">
                copyrights &#169; 2026
              </h3>
              <ul className=" space-y-2 text-center text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home