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

  // Fetch course and user progress from backend
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!storedUser) return;
    setUser(storedUser);

    // Fetch course details
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${API_BASE}/courses/${id}`);
        if (!res.ok) throw new Error("Course not found");

        const data = await res.json();
        setCourse(data);

        // Fetch user progress for this course
        const progressRes = await fetch(
          `${API_BASE}/progress/${storedUser.id}/${id}`
        );
        if (!progressRes.ok) throw new Error("Failed to fetch progress");

        const progressData = await progressRes.json();
        setCompleted(progressData.completedTopics || []);
        setQuizDone(progressData.quizPassed || false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourse();
  }, [id]);

  const toggleComplete = async (index) => {
    if (!user || !course) return;

    const updated = completed.includes(index)
      ? completed.filter((i) => i !== index)
      : [...completed, index];

    setCompleted(updated);

    // Save progress to backend
    try {
      await fetch(`${API_BASE}/progress/${user.id}/${course.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completedTopics: updated }),
      });
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  const handleQuizClick = () => {
    setQuizDone(false);
    navigate(`/quiz/${course.id}`);
  };

  if (!course || !user)
    return <h2 style={{ padding: "40px" }}>Loading course...</h2>;

  const progress = course.topics.length
    ? (completed.length / course.topics.length) * 100
    : 0;

  return (
    <div className="course-player">
      <h1>{course.title}</h1>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {course.topics.map((topic, index) => (
        <details key={index} className="topic">
          <summary>
            {topic.title}
            {completed.includes(index) && " ✅"}
          </summary>
          <p>{topic.content}</p>
          <button onClick={() => toggleComplete(index)}>
            {completed.includes(index) ? "Mark Incomplete" : "Mark as Complete"}
          </button>
        </details>
      ))}

      <button
        className="quiz-btn"
        disabled={completed.length !== course.topics.length}
        onClick={handleQuizClick}
      >
        {quizDone ? "Retake Quiz" : "Start Quiz"}
      </button>
    </div>
  );
};

export default CoursePlayer;
