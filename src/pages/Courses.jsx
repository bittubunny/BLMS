import { useEffect, useState } from "react";
import "./Courses.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://blms-fnj5.onrender.com";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  /* ---------- FETCH COURSES FROM BACKEND ---------- */
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE}/courses`);
      if (!res.ok) throw new Error("Failed to fetch courses");

      const data = await res.json();
      setCourses(data); // update state directly from backend
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();

    // Refetch courses when tab gains focus
    const handleFocus = () => fetchCourses();
    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <div className="courses-page">
      <h1>Our Courses</h1>

      {courses.length === 0 && <p>No courses available</p>}

      <div className="courses-grid">
        {courses.map((course) => (


<div className="course-card" key={course.id}>
  <div className="course-image">
    <img
      src={course.image || "https://via.placeholder.com/500x300"}
      alt={course.title}
    />
  </div>

  <div className="course-content">
    <h3>{course.title}</h3>

    <p>{course.description}</p>

    <div className="course-footer">
      <span>{course.duration}</span>

      <button
        onClick={() => navigate(`/course/${course.id}`)}
      >
        Start Learning →
      </button>
    </div>
  </div>
</div>





      
      
        ))}
      </div>
    </div>
  );
};

export default Courses;
