import { Navigate,Routes, Route, Link, Links} from "react-router-dom"
import Home from './pages/Home.jsx'
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Courses from "./components/Courses.jsx";
import Buy from "./components/Buy.jsx";
import Purchases from "./components/Purchases.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminSignup from "./admin/AdminSignup.jsx";
import DashBoard from "./admin/DashBoard.jsx";
import OurCourses from "./admin/OurCourses.jsx";
import UpdateCourse from "./admin/UpdateCourse.jsx";
import CourseCreate from "./admin/CourseCreate.jsx";
import Dashboard from "./admin/DashBoard.jsx";
const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>

        <Route path="/courses" element={<Courses/>}/>
        <Route path="/buy/:courseId" element={<Buy/>}/>
        <Route path="/purchases" element={<Purchases/>}/>

        {/* Admin Routes */}

        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin/signup" element={<AdminSignup/>}/>
        <Route
          path="/admin/dashboard"
          element={admin ? <Dashboard /> : <Navigate to={"/admin/login"} />}
        />
        <Route path="/admin/our-courses" element={<OurCourses/>}/>
        <Route path="/admin/update-course/:id" element={<UpdateCourse/>}/>
        <Route path="/admin/create-course" element={<CourseCreate/>}/>
        
      </Routes>
    </>
  )
}

export default App;