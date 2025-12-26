import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [certificates, setCertificates] = useState({});

  if (!user) return <h2>Please login to view dashboard</h2>;

  useEffect(() => {
    const fetchCoursesAndProgress = async () => {
      try {
        const res = await fetch(`${API_BASE}/courses`);
        if (!res.ok) throw new Error("Failed to fetch courses");
        const coursesData = await res.json();
        setCourses(coursesData);

        const progressData = {};
        const certData = {};

        for (const course of coursesData) {
          const progRes = await fetch(`${API_BASE}/progress/${user.id}/${course.id}`); // Now uses correct user.id
          const prog = progRes.ok ? await progRes.json() : { completed_topics: [], quiz_results: {}, certificate_earned: false };

          const quizScore = Object.values(prog.quiz_results || {})[0] || 0;
          const totalQuestions = course.quiz?.length || 0;
          const quizPassed = totalQuestions ? quizScore / totalQuestions >= 0.6 : false;

          progressData[course.id] = {
            completedTopics: prog.completed_topics || [],
            quizScore,
            totalQuestions,
            quizPassed,
          };

          if (quizPassed) {
            certData[course.id] = {
              courseTitle: course.title,
              verificationId: `BLMS-${course.title.replace(/\s+/g, "").substring(0, 5).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
              issuedAt: new Date().toISOString(),
            };
          }
        }

        setProgress(progressData);
        setCertificates(certData);
      } catch (err) {
        console.error(err);
        setProgress({});
        setCertificates({});
      }
    };

    fetchCoursesAndProgress();
  }, [user?.id]);

  const getCourseTitle = (id) => {
    const course = courses.find((c) => c.id === id);
    return course ? course.title : `Course ${id}`;
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}</h1>

      <h2>Completed Courses</h2>
      {courses.length === 0 ? (
        <p>Loading courses...</p>
      ) : Object.keys(progress).length === 0 ? (
        <p>No courses completed yet</p>
      ) : (
        Object.entries(progress).map(([cid, data]) => (
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
        ))
      )}
    </div>
  );
};

export default Dashboard;
