import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CoursePlayer from "./pages/CoursePlayer";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";
import Certificate from "./pages/Certificate";
import EditProfile from "./pages/EditProfile"; // import the new page
import Announcements from "./pages/Announcements";
import Users from "./admin/Users";
// admin (separate, not part of main flow)
import Add_Course from "./admin/Add_Course";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* USER PAGES */}
        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CoursePlayer />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/certificate/:id" element={<Certificate />} />
        <Route path="/edit-profile" element={<EditProfile />} /> {/* new route */}
        <Route path="/announcements" element={<Announcements />} />

        {/* ADMIN ONLY – MANUAL ACCESS */}
        <Route path="/admin/add-course" element={<Add_Course />} />
        <Route path="/admin/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
