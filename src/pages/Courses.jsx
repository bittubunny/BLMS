import { useEffect, useMemo, useState } from "react";
import "./Courses.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://blms-fnj5.onrender.com";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  /* ---------------- FETCH COURSES ---------------- */

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE}/courses`);

      if (!res.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await res.json();

      setCourses(data);
    } catch (err) {
      console.error(err);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();

    const handleFocus = () => fetchCourses();

    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  /* ---------------- SEARCH ---------------- */

  const filteredCourses = useMemo(() => {
    return courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  return (
    <div className="courses-page">

      {/* ================= HERO ================= */}

      <section className="courses-hero">

        <div className="courses-hero-left">

          <span className="hero-badge">
            📚 Learn Without Limits
          </span>

          <h1>
            Explore Our Courses
          </h1>

          <p>
            Discover high-quality learning paths designed to help you
            build practical skills, earn certificates, and prepare for
            your future career.
          </p>

          <div className="course-search">

            <input
              type="text"
              placeholder="🔍 Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>

          <div className="course-count">

            {filteredCourses.length} Course
            {filteredCourses.length !== 1 && "s"} Available

          </div>

        </div>

        <div className="courses-hero-right">

          <div className="hero-circle">
            📖
          </div>

          <div className="floating-card floating-one">
            💻
          </div>

          <div className="floating-card floating-two">
            🎓
          </div>

          <div className="floating-card floating-three">
            🚀
          </div>

          <div className="floating-card floating-four">
            📚
          </div>

        </div>

      </section>

      {/* ================= COURSES ================= */}

      <section className="courses-section">

        <h2>
          Featured Courses
        </h2>

        <p>
          Choose a course and begin your learning journey today.
        </p>

        {filteredCourses.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              📚
            </div>

            <h3>No Courses Found</h3>

            <p>
              Try searching with another keyword.
            </p>

          </div>

        ) : (

          <div className="courses-grid">

            {filteredCourses.map((course) => (

              <div
                className="course-card"
                key={course.id}
              >

                <div className="course-image-wrapper">

                  <img
                    src={
                      course.image ||
                      "https://via.placeholder.com/400x220"
                    }
                    alt={course.title}
                  />

                  <div className="difficulty-badge">
                    🟢 Beginner
                  </div>

                </div>

                <div className="course-content">

                  <h3>
                    {course.title}
                  </h3>

                  <p>
                    {course.description}
                  </p>

                  <div className="course-meta">

                    <div>
                      ⏱ {course.duration}
                    </div>

                    <div>
                      📖 {course.topics?.length || 0} Topics
                    </div>

                  </div>

                  <button
                    onClick={() =>
                      navigate(`/course/${course.id}`)
                    }
                  >
                    Start Learning →
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
};

export default Courses;
