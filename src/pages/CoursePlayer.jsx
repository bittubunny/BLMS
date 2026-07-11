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

  // NEW
  const [showAchievement, setShowAchievement] = useState(false);

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

        if (
          selectedCourse.topics &&
          progressData.completed_topics &&
          progressData.completed_topics.length ===
            selectedCourse.topics.length
        ) {
          setShowAchievement(true);
        }

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

      if (updated.length === course.topics.length) {
        setTimeout(() => {
          setShowAchievement(true);
        }, 600);
      } else {
        setShowAchievement(false);
      }

    } catch (err) {
      console.error("Failed to update topic progress:", err);
    }
  };

  const handleQuizClick = () => {
    navigate(`/quiz/${course.id}`);
  };

  if (!user)
    return (
      <h2 style={{ padding: "40px" }}>
        Please login to access this course
      </h2>
    );

  if (!course)
    return (
      <h2 style={{ padding: "40px" }}>
        Loading course...
      </h2>
    );

  const progress = course.topics.length
    ? (completed.length / course.topics.length) * 100
    : 0;

  return (
    <div className="course-player">

      <h1>{course.title}</h1>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p
        style={{
          textAlign: "right",
          fontWeight: "600",
          color: "#2563eb",
          marginBottom: "25px",
        }}
      >
        {Math.round(progress)}% Completed
      </p>

      {course.topics.map((topic, index) => (
        <details
          key={index}
          className="topic"
        >
          <summary>
            {topic.title}
            {completed.includes(index) && " ✅"}
          </summary>

          <p>{topic.content}</p>

          <button
            onClick={() => toggleComplete(index)}
          >
            {completed.includes(index)
              ? "Mark Incomplete"
              : "Mark as Complete"}
          </button>

        </details>
      ))}
      {showAchievement && (
        <div className="achievement-card">

          <div className="achievement-overlay"></div>

          <div className="achievement-content">

            <div className="trophy">
              🏆
            </div>

            <h2>Outstanding Work!</h2>

            <p>
              You've successfully completed every lesson in this course.
            </p>

            <p className="quote">
              "Success is built one lesson at a time. Your dedication has
              brought you this far, and now it's time to prove what you've
              learned."
            </p>

            <h3>
              🎉 You are now eligible to take the Final Quiz!
            </h3>

            <div className="stars">
              ⭐ ⭐ ⭐ ⭐ ⭐
            </div>

          </div>

        </div>
      )}

      <button
        className="quiz-btn"
        disabled={completed.length !== course.topics.length}
        onClick={handleQuizClick}
      >
        {quizDone ? "Retake Quiz" : "Start Final Quiz"}
      </button>

    </div>
  );
};

export default CoursePlayer;


      
