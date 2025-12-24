import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [certificates, setCertificates] = useState({});

  if (!user) return <h2>Please login to view dashboard</h2>;

  useEffect(() => {
    // Fetch all courses
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE}/courses`);
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    // Fetch user progress for all courses
    const fetchProgress = async () => {
      const progressData = {};
      const certData = {};
      for (const course of courses) {
        try {
          const res = await fetch(`${API_BASE}/progress/${user.id}/${course.id}`);
          const data = await res.json();
          progressData[course.id] = {
            completedTopics: data.completed_topics || [],
            quizPassed:
              Object.values(data.quiz_results || {})[0] >=
              0.6 * (course.quiz?.length || 1),
            quizScore: Object.values(data.quiz_results || {})[0] || 0,
            totalQuestions: course.quiz?.length || 0,
          };

          if (progressData[course.id].quizPassed) {
            certData[course.id] = {
              courseTitle: course.title,
              verificationId: `BLMS-${course.title
                .replace(/\s+/g, "")
                .substring(0, 5)
                .toUpperCase()}-${Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase()}`,
              issuedAt: new Date().toISOString(),
            };
          }
        } catch (err) {
          console.error("Failed to fetch progress for course:", course.id, err);
        }
      }
      setProgress(progressData);
      setCertificates(certData);
    };

    fetchCourses().then(fetchProgress);
  }, [user, courses.length]);

  const getCourseTitle = (id) => {
    const course = courses.find((c) => c.id === id);
    return course ? course.title : `Course ${id}`;
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}</h1>

      <h2>Completed Courses</h2>
      {Object.keys(progress).length === 0 && <p>No courses yet</p>}

      {Object.entries(progress).map(([cid, data]) => (
        <div key={cid} className="dash-card">
          <div>
            <p>
              Course: <strong>{getCourseTitle(cid)}</strong>
            </p>
            <p>
              Score: {data.quizScore} / {data.totalQuestions}
            </p>
          </div>
          <div>
            {certificates[cid] ? (
              <Link to={`/certificate/${cid}`}>View Certificate</Link>
            ) : (
              <span>Certificate Locked</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
