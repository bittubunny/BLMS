import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);

  if (!user) {
    return <h2 style={{ padding: "40px" }}>Please login to view dashboard</h2>;
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch all courses (GLOBAL)
        const courseRes = await fetch(`${API_BASE}/courses`);
        const courseData = await courseRes.json();
        setCourses(courseData);

        // 2. Fetch USER-SPECIFIC progress
        const progressMap = {};

        for (const course of courseData) {
          const progRes = await fetch(
            `${API_BASE}/progress/${user.id}/${course.id}`
          );
          const prog = await progRes.json();

          // Only store if user has attempted something
          const quizScore = prog.quiz_results?.final ?? null;

          if (quizScore !== null) {
            const totalQuestions = course.quiz?.length || 0;
            const passed =
              totalQuestions > 0
                ? quizScore / totalQuestions >= 0.6
                : false;

            progressMap[course.id] = {
              courseTitle: course.title,
              score: quizScore,
              total: totalQuestions,
              passed,
            };
          }
        }

        setUserProgress(progressMap);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  if (loading) {
    return <h2 style={{ padding: "40px" }}>Loading dashboard...</h2>;
  }

  const completedCourseIds = Object.keys(userProgress);

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}</h1>

      <h2>Completed Courses</h2>

      {completedCourseIds.length === 0 ? (
        <p>No courses completed yet</p>
      ) : (
        completedCourseIds.map((courseId) => {
          const data = userProgress[courseId];

          return (
            <div key={courseId} className="dash-card">
              <div>
                <p>
                  Course: <strong>{data.courseTitle}</strong>
                </p>
                <p>
                  Score: {data.score} / {data.total}
                </p>
              </div>

              <div>
                {data.passed ? (
                  <Link to={`/certificate/${courseId}`}>
                    View Certificate
                  </Link>
                ) : (
                  <span>Certificate Locked</span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Dashboard;
