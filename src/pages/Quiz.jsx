import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Quiz.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Quiz = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [course, setCourse] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [quizLocked, setQuizLocked] = useState(false);
  const [certUnlocked, setCertUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH COURSE + USER PROGRESS ================= */
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch course
        const courseRes = await fetch(`${API_BASE}/courses/${courseId}`);
        if (!courseRes.ok) throw new Error("Course not found");
        const courseData = await courseRes.json();
        setCourse(courseData);

        // Fetch progress (USER-SPECIFIC)
        const progressRes = await fetch(
          `${API_BASE}/progress/${user.id}/${courseId}`
        );
        const progressData = await progressRes.json();

        const quizResults = progressData.quiz_results || {};
        const previousScore = quizResults.final ?? null;

        if (previousScore !== null) {
          const passed =
            previousScore / (courseData.quiz.length || 1) >= 0.6;

          setScore(previousScore);
          setFinished(true);
          setQuizLocked(true);
          setCertUnlocked(passed);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.history.replaceState({}, "");
  }, [courseId, user]);

  /* ================= GUARDS ================= */
  if (!user)
    return <h2 style={{ padding: "40px" }}>Please login to take the quiz</h2>;

  if (loading)
    return <h2 style={{ padding: "40px" }}>Loading quiz...</h2>;

  if (!course || !course.quiz || course.quiz.length === 0)
    return <h2 style={{ padding: "40px" }}>No quiz available</h2>;

  const quiz = course.quiz;

  /* ================= ANSWER HANDLER ================= */
  const answer = async (option) => {
    if (quizLocked) return;

    const isCorrect = option === quiz[qIndex].answer;
    const newScore = isCorrect ? score + 1 : score;

    if (qIndex + 1 < quiz.length) {
      setScore(newScore);
      setQIndex(qIndex + 1);
    } else {
      // FINAL SUBMIT
      const finalScore = newScore;
      const passed = finalScore / quiz.length >= 0.6;

      setScore(finalScore);
      setFinished(true);
      setQuizLocked(true);
      setCertUnlocked(passed);

      try {
        await fetch(
          `${API_BASE}/progress/${user.id}/${courseId}/quiz`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              quiz_id: "final",
              score: finalScore,
            }),
          }
        );
      } catch (err) {
        console.error("Quiz save failed:", err);
      }

      navigate("/dashboard", { replace: true });
    }
  };

  /* ================= RETAKE ================= */
  const retakeQuiz = () => {
    setQIndex(0);
    setScore(0);
    setFinished(false);
    setQuizLocked(false);
    setCertUnlocked(false);
    window.history.replaceState({}, "");
  };

  /* ================= UI ================= */
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
            <p className="certificate-unlocked">🎖 Certificate Unlocked</p>
          ) : (
            <p className="certificate-locked">❌ Certificate Locked</p>
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
