import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Quiz.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [course, setCourse] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [certUnlocked, setCertUnlocked] = useState(false);
  const [quizLocked, setQuizLocked] = useState(false);

  // Fetch course and user progress
  useEffect(() => {
    if (!user) return;

    const fetchCourseAndProgress = async () => {
      try {
        // Fetch course details
        const res = await fetch(`${API_BASE}/courses/${id}`);
        if (!res.ok) throw new Error("Course not found");
        const selectedCourse = await res.json();
        setCourse(selectedCourse);

        // Fetch user progress for this course
        const progressRes = await fetch(`${API_BASE}/progress/${user.id}/${id}`);
        if (!progressRes.ok) throw new Error("Failed to fetch progress");
        const progressData = await progressRes.json();

        const quizResults = progressData.quiz_results || {};
        const previousScore = quizResults["final"] || 0;
        const passed = previousScore / (selectedCourse.quiz.length || 1) >= 0.6;

        if (passed) {
          setScore(previousScore);
          setFinished(true);
          setCertUnlocked(true);
          setQuizLocked(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourseAndProgress();
    window.history.replaceState({}, ""); // prevent back navigation
  }, [id, user]);

  if (!user) return <h2 style={{ padding: "40px" }}>Please login to take the quiz</h2>;
  if (!course || !course.quiz || course.quiz.length === 0) return <h2 style={{ padding: "40px" }}>No quiz found for this course</h2>;

  const quiz = course.quiz;

  const answer = async (option) => {
    if (quizLocked) return;

    const isCorrect = option === quiz[qIndex].answer;
    const newScore = isCorrect ? score + 1 : score;

    if (qIndex + 1 < quiz.length) {
      setScore(newScore);
      setQIndex(qIndex + 1);
    } else {
      const finalScore = newScore;
      setScore(finalScore);
      setFinished(true);
      setQuizLocked(true);
      if (finalScore / quiz.length >= 0.6) setCertUnlocked(true);

      // Save quiz result to backend
      try {
        await fetch(`${API_BASE}/progress/${user.id}/${course.id}/quiz`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quiz_id: "final", score: finalScore }),
        });
      } catch (err) {
        console.error("Failed to save quiz result:", err);
      }

      navigate("/dashboard", { replace: true });
    }
  };

  const retakeQuiz = () => {
    setScore(0);
    setQIndex(0);
    setFinished(false);
    setCertUnlocked(false);
    setQuizLocked(false);
    window.history.replaceState({}, "");
  };

  return (
    <div className="quiz-page">
      {!finished ? (
        <>
          <h3>
            Question {qIndex + 1} of {quiz.length}
          </h3>
          <h4>{quiz[qIndex].question}</h4>
          <div className="quiz-options">
            {quiz[qIndex].options.map((option, idx) => (
              <button key={idx} onClick={() => answer(option)}>
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2>Quiz Completed 🎉</h2>
          <p>
            Score: <strong>{score}</strong> / {quiz.length} (
            {Math.round((score / quiz.length) * 100)}%)
          </p>

          {certUnlocked ? (
            <p className="certificate-unlocked">🎖 Certificate Unlocked!</p>
          ) : (
            <p className="certificate-locked">❌ Try Next Time</p>
          )}

          <button
            className="dashboard-btn"
            onClick={() => navigate("/dashboard", { replace: true })}
          >
            Go to Dashboard
          </button>

          {!certUnlocked && (
            <button className="retake-btn" onClick={retakeQuiz}>
              Retake Quiz
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Quiz;
