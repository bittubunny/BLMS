import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./CoursePlayer.css";

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [user, setUser] = useState(null);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!storedUser) return;
    setUser(storedUser);

    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const selectedCourse = courses.find(c => c.id === parseInt(id));
    if (!selectedCourse) return;
    setCourse(selectedCourse);

    const progressKey = `progress-${storedUser.username}-${selectedCourse.id}`;
    const savedProgress = JSON.parse(localStorage.getItem(progressKey)) || [];
    setCompleted(savedProgress);

    // Check if quiz already done
    const userProgress = JSON.parse(localStorage.getItem(`progress-${storedUser.username}`)) || { courses: {} };
    if (userProgress.courses?.[selectedCourse.id]?.quizPassed) {
      setQuizDone(true);
    }
  }, [id]);

  const toggleComplete = (index) => {
    if (!user || !course) return;

    const updated = completed.includes(index)
      ? completed.filter(i => i !== index)
      : [...completed, index];

    setCompleted(updated);

    const progressKey = `progress-${user.username}-${course.id}`;
    localStorage.setItem(progressKey, JSON.stringify(updated));
  };

  const handleQuizClick = () => {
    // Reset quizDone temporarily to allow fresh attempt
    setQuizDone(false);
    navigate(`/quiz/${course.id}`);
  };

  if (!course || !user) return <h2 style={{ padding: "40px" }}>Loading course...</h2>;

  const progress = (completed.length / course.topics.length) * 100;

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
