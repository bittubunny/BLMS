import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Quiz.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Quiz = () => {
  const { id } = useParams(); // course ID
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [course, setCourse] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [certUnlocked, setCertUnlocked] = useState(false);
  const [quizLocked, setQuizLocked] = useState(false);

  // Fetch course and user progress
  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to login
      return;
    }

    const fetchCourseAndProgress = async () => {
      try {
        // Fetch course
        const res = await fetch(`${API_BASE}/courses/${id}`);
        if (!res.ok) throw new Error("Course not found");
        const selectedCourse = await res.json();
        setCourse(selectedCourse);

        // Fetch user progress for this course (now uses correct user.id)
        const progressRes = await fetch(`${API_BASE}/progress/${user.id}/${id}`);
        const progressData = progressRes.ok ? await progressRes.json() : { quiz_results: {} };

        const quizResults = progressData.quiz_results || {};
        const previousScore = quizResults["final"] || 0;
        const passed = previousScore / (selectedCourse.quiz.length || 1) >= 0.6;

        setScore(passed ? previousScore : 0);
        setFinished(passed);
        setCertUnlocked(passed);
        setQuizLocked(passed);
        setQIndex(0); // start from first question
      } catch (err) {
        console.error(err);
        setCourse(null);
        setScore(0);
        setFinished(false);
        setCertUnlocked(false);
        setQuizLocked(false);
        setQIndex(0);
      }
    };

    fetchCourseAndProgress();
  }, [id, user?.id, navigate]);

  if (!user) return <h2 style={{ padding: "40px" }}>Please login to take the quiz</h2>;
  if (!course) return <h2 style={{ padding: "40px" }}>Loading course...</h2>;
  if (!course.quiz || course.quiz.length === 0) return <h2 style={{ padding: "40px" }}>No quiz found for this course</h2>;

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

      // Save quiz result for this user
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
