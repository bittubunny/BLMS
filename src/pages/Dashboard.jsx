import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [courses, setCourses] = useState([]);
  const [learning, setLearning] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    startedCourses: 0,
    certificates: 0,
    averageScore: 0,
  });

  if (!user) return <h2>Please login to view dashboard.</h2>;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const courseRes = await fetch(`${API_BASE}/courses`);

        if (!courseRes.ok) throw new Error("Unable to fetch courses");

        const courseList = await courseRes.json();

        setCourses(courseList);

        const progressResponses = await Promise.all(
          courseList.map(async (course) => {
            const res = await fetch(
              `${API_BASE}/progress/${user.id}/${course.id}`
            );

            const prog = res.ok
              ? await res.json()
              : {
                  completed_topics: [],
                  quiz_results: {},
                  certificate_earned: false,
                };

            const completedTopics = prog.completed_topics || [];

            const quizResults = prog.quiz_results || {};

            const quizScore =
              Object.values(quizResults).length > 0
                ? Object.values(quizResults)[0]
                : 0;

            const totalQuestions = course.quiz?.length || 0;

            const progressPercent =
              course.topics && course.topics.length
                ? Math.round(
                    (completedTopics.length / course.topics.length) * 100
                  )
                : 0;

            const started =
              completedTopics.length > 0 ||
              Object.keys(quizResults).length > 0;

            return {
              id: course.id,
              title: course.title,
              totalQuestions,
              quizScore,
              progressPercent,
              certificate: prog.certificate_earned,
              started,
            };
          })
        );

        const startedCourses = progressResponses.filter(
          (c) => c.started
        );

        const certificates = startedCourses.filter(
          (c) => c.certificate
        ).length;

        const averageScore =
          startedCourses.length > 0
            ? Math.round(
                startedCourses.reduce((sum, c) => {
                  if (!c.totalQuestions) return sum;

                  return (
                    sum +
                    (c.quizScore / c.totalQuestions) * 100
                  );
                }, 0) / startedCourses.length
              )
            : 0;

        setLearning(startedCourses);

        setStats({
          totalCourses: courseList.length,
          startedCourses: startedCourses.length,
          certificates,
          averageScore,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, [user.id]);

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>Welcome back, {user.name} 👋</h1>
        <p>Track your learning progress and certificates.</p>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <h2>{stats.totalCourses}</h2>
          <p>Total Courses</p>
        </div>

        <div className="stat-card">
          <h2>{stats.startedCourses}</h2>
          <p>Started</p>
        </div>

        <div className="stat-card">
          <h2>{stats.certificates}</h2>
          <p>Certificates</p>
        </div>

        <div className="stat-card">
          <h2>{stats.averageScore}%</h2>
          <p>Average Score</p>
        </div>

      </div>

      <h2 className="section-title">My Learning</h2>

      {learning.length === 0 ? (
        <div className="empty-card">
          <h3>No learning activity yet.</h3>
          <p>Start a course to see your progress here.</p>
        </div>
      ) : (
        learning.map((course) => (
          <div className="learning-card" key={course.id}>

            <div className="learning-info">

              <h3>{course.title}</h3>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${course.progressPercent}%`,
                  }}
                />
              </div>

              <p className="progress-text">
                Progress: {course.progressPercent}%
              </p>

              <p>
                Quiz Score:{" "}
                <strong>
                  {course.quizScore} / {course.totalQuestions}
                </strong>
              </p>

            </div>

            <div className="learning-actions">

              {course.certificate ? (
                <>
                  <span className="badge success">
                    Certificate Earned
                  </span>

                  <Link
                    className="action-btn"
                    to={`/certificate/${course.id}`}
                  >
                    View Certificate
                  </Link>
                </>
              ) : (
                <>
                  <span className="badge locked">
                    Certificate Locked
                  </span>

                  <Link
                    className="action-btn"
                    to={`/course/${course.id}`}
                  >
                    Continue Learning
                  </Link>
                </>
              )}

            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
