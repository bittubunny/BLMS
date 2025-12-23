import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Quiz.css";

const STORAGE_KEY = "courses";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <h2 style={{ padding: "40px" }}>Please login to take the quiz</h2>;
  }

  const progressKey = `progress-${user.email}`;
  const [course, setCourse] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [certUnlocked, setCertUnlocked] = useState(false);
  const [quizLocked, setQuizLocked] = useState(false);

  useEffect(() => {
    const courses = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const found = courses.find((c) => c.id === Number(id));
    setCourse(found || null);

    // Prevent back navigation to previous quiz answers
    window.history.replaceState({}, "");
  }, [id]);

  if (!course || !course.quiz || course.quiz.length === 0) {
    return <h2 style={{ padding: "40px" }}>No quiz found for this course</h2>;
  }

  const quiz = course.quiz;

  const answer = (option) => {
    if (quizLocked) return; // prevent changing old answers

    const isCorrect = option === quiz[qIndex].answer;
    const newScore = isCorrect ? score + 1 : score;

    if (qIndex + 1 < quiz.length) {
      setScore(newScore);
      setQIndex(qIndex + 1);
    } else {
      const finalScore = newScore;
      saveResult(finalScore);
      setScore(finalScore);
      setFinished(true);
      setQuizLocked(true);
      if (finalScore / quiz.length >= 0.6) setCertUnlocked(true);

      // Replace history to prevent back navigation
      navigate("/dashboard", { replace: true });
    }
  };

  const saveResult = (finalScore) => {
    const data = JSON.parse(localStorage.getItem(progressKey)) || {
      courses: {},
      certificates: {},
    };

    const verificationId = `BLMS-${course.title
      .replace(/\s+/g, "")
      .substring(0, 5)
      .toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase()}`;

    data.courses[id] = {
      quizScore: finalScore,
      totalQuestions: quiz.length,
      quizPassed: finalScore / quiz.length >= 0.6,
      completedAt: new Date().toISOString(),
    };

    if (finalScore / quiz.length >= 0.6) {
      data.certificates[id] = {
        courseTitle: course.title,
        verificationId,
        issuedAt: new Date().toISOString(),
      };
    }

    localStorage.setItem(progressKey, JSON.stringify(data));
  };

  const retakeQuiz = () => {
    setScore(0);
    setQIndex(0);
    setFinished(false);
    setCertUnlocked(false);
    setQuizLocked(false);

    // Replace history to prevent back navigation issues
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
            {quiz[qIndex].options.map((option, index) => (
              <button key={index} onClick={() => answer(option)}>
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

          <button className="dashboard-btn" onClick={() => navigate("/dashboard", { replace: true })}>
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
