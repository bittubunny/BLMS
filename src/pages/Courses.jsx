import { useEffect, useState } from "react";
import "./Courses.css";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "courses";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = () => {
      const storedCourses =
        JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

      setCourses(storedCourses);
    };

    loadCourses();

    window.addEventListener("storage", loadCourses);
    window.addEventListener("focus", loadCourses);

    return () => {
      window.removeEventListener("storage", loadCourses);
      window.removeEventListener("focus", loadCourses);
    };
  }, []);

  return (
    <div className="courses-page">
      <h1>Our Courses</h1>

      {courses.length === 0 && <p>No courses available</p>}

      <div className="courses-grid">
        {courses.map((course) => (
          <div className="course-card" key={course.id}>
            <img
              src={course.image || "https://via.placeholder.com/150"}
              alt={course.title}
            />

            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <span>Duration: {course.duration}</span>

            <button
              onClick={() => navigate(`/course/${course.id}`)}
            >
              Start Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
