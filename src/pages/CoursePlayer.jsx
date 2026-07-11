import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./CoursePlayer.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [user, setUser] = useState(null);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/");
      return;
    }

    setUser(storedUser);

    const fetchData = async () => {
      try {
        const courseRes = await fetch(`${API_BASE}/courses/${id}`);

        if (!courseRes.ok) throw new Error("Course not found");

        const selectedCourse = await courseRes.json();

        setCourse(selectedCourse);

        const progressRes = await fetch(
          `${API_BASE}/progress/${storedUser.id}/${id}`
        );

        if (!progressRes.ok)
          throw new Error("Failed to fetch progress");

        const progressData = await progressRes.json();

        setCompleted(progressData.completed_topics || []);

        setQuizDone(
          Object.keys(progressData.quiz_results || {}).length > 0
        );
      } catch (err) {
        console.error(err);
        setCourse(null);
      }
    };

    fetchData();
  }, [id, navigate]);

  const toggleComplete = async (index) => {
    if (!user || !course) return;

    const updated = completed.includes(index)
      ? completed.filter((i) => i !== index)
      : [...completed, index];

    setCompleted(updated);

    try {
      await fetch(
        `${API_BASE}/progress/${user.id}/${course.id}/topic`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic_id: index,
          }),
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuizClick = () => {
    navigate(`/quiz/${course.id}`);
  };

  if (!user)
    return (
      <h2 style={{ padding: "40px" }}>
        Please login to access this course.
      </h2>
    );

  if (!course)
    return (
      <h2 style={{ padding: "40px" }}>
        Loading Course...
      </h2>
    );

  const progress = course.topics.length
    ? (completed.length / course.topics.length) * 100
    : 0;

  const allCompleted =
    completed.length === course.topics.length;

  return (
    <div className="course-player">

      {/* ================= HERO ================= */}

      <section className="player-header">

        <span className="hero-badge">
          📘 Learning Journey
        </span>

        <h1>{course.title}</h1>

        <p>
          Complete every lesson to unlock the final quiz and
          earn your BLMS certificate.
        </p>

      </section>

      {/* ================= PROGRESS ================= */}

      <section className="progress-card">

        <div className="progress-top">

          <h3>Your Progress</h3>

          <span>
            {completed.length} / {course.topics.length} Lessons
          </span>

        </div>

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />

        </div>

        <div className="progress-percent">

          {Math.round(progress)}% Completed

        </div>

      </section>

      {/* ================= TOPICS ================= */}

      <section className="topics-section">

        {course.topics.map((topic, index) => (

          <details
            key={index}
            className={`topic-card ${
              completed.includes(index)
                ? "completed"
                : ""
            }`}
          >

            <summary>

              <div className="topic-title">

                <span className="topic-icon">
                  📖
                </span>

                {topic.title}

              </div>

              {completed.includes(index) && (
                <span className="completed-badge">
                  ✅
                </span>
              )}

            </summary>

            <div className="topic-content">

              <p>{topic.content}</p>

              <button
                onClick={() =>
                  toggleComplete(index)
                }
              >
                {completed.includes(index)
                  ? "✓ Mark Incomplete"
                  : "✓ Mark as Complete"}
              </button>

            </div>

          </details>

        ))}

      </section>

      {/* ================= ACHIEVEMENT ================= */}

      {allCompleted && (

        <div className="achievement-banner">

          <div className="achievement-icon">
            🏆
          </div>

          <h2>
            Outstanding Work!
          </h2>

          <p>
            You've completed every lesson in this course.
            You're now eligible to take the final quiz and
            earn your certificate.
          </p>

          <button
            className="quiz-btn"
            onClick={handleQuizClick}
          >
            {quizDone
              ? "Retake Quiz"
              : "🚀 Start Final Quiz"}
          </button>

        </div>

      )}

      {!allCompleted && (

        <button
          className="quiz-btn locked"
          disabled
        >
          Complete all lessons to unlock the quiz
        </button>

      )}

    </div>
  );
};

export default CoursePlayer;
