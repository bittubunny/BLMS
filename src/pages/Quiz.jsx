import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Quiz.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [course, setCourse] = useState(null);

  const [qIndex, setQIndex] = useState(0);

  const [score, setScore] = useState(0);

  const [finished, setFinished] = useState(false);

  const [certUnlocked, setCertUnlocked] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await fetch(`${API_BASE}/courses/${id}`);

        if (!res.ok)
          throw new Error("Course not found");

        const selectedCourse = await res.json();

        setCourse(selectedCourse);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  if (!user)
    return (
      <h2 style={{ padding: "40px" }}>
        Please login to take this quiz.
      </h2>
    );

  if (loading)
    return (
      <h2 style={{ padding: "40px" }}>
        Loading Quiz...
      </h2>
    );

  if (!course)
    return (
      <h2 style={{ padding: "40px" }}>
        Course not found.
      </h2>
    );

  if (!course.quiz || course.quiz.length === 0)
    return (
      <h2 style={{ padding: "40px" }}>
        No quiz available.
      </h2>
    );

  const quiz = course.quiz;

  const progress =
    ((qIndex + 1) / quiz.length) * 100;

  const handleAnswer = async (option) => {
    if (selectedOption) return;

    setSelectedOption(option);

    const correct =
      option === quiz[qIndex].answer;

    let newScore = score;

    if (correct) {
      newScore += 1;
      setScore(newScore);
    }

    setTimeout(async () => {
      if (qIndex + 1 < quiz.length) {
        setQIndex((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        const passed =
          newScore / quiz.length >= 0.6;

        setFinished(true);

        setCertUnlocked(passed);

        try {
          await fetch(
            `${API_BASE}/progress/${user.id}/${course.id}/quiz`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                quiz_id: "final",
                score: newScore,
              }),
            }
          );
        } catch (err) {
          console.error(err);
        }
      }
    }, 700);
  };

  const restartQuiz = () => {
    setQIndex(0);
    setScore(0);
    setFinished(false);
    setCertUnlocked(false);
    setSelectedOption(null);
  };


  return (
    <div className="quiz-page">

      {!finished ? (

        <>
          {/* ================= HERO ================= */}

          <div className="quiz-header">

            <span className="quiz-badge">
              🎓 Final Assessment
            </span>

            <h1>{course.title}</h1>

            <p>
              Test your understanding of this course.
              Score at least <strong>60%</strong> to unlock your certificate.
            </p>

          </div>

          {/* ================= PROGRESS ================= */}

          <div className="quiz-progress-card">

            <div className="quiz-progress-top">

              <span>
                Question {qIndex + 1} of {quiz.length}
              </span>

              <span>
                {Math.round(progress)}%
              </span>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

          {/* ================= QUESTION ================= */}

          <div className="question-card">

            <h2>

              {quiz[qIndex].question}

            </h2>

            <div className="quiz-options">

              {quiz[qIndex].options.map((option, idx) => {

                const isSelected =
                  selectedOption === option;

                const isCorrect =
                  option === quiz[qIndex].answer;

                let className = "option-btn";

                if (selectedOption) {

                  if (isCorrect)
                    className += " correct";

                  else if (isSelected)
                    className += " wrong";

                }

                return (

                  <button
                    key={idx}
                    className={className}
                    disabled={selectedOption !== null}
                    onClick={() => handleAnswer(option)}
                  >

                    <span className="option-letter">

                      {String.fromCharCode(65 + idx)}

                    </span>

                    <span className="option-text">

                      {option}

                    </span>

                  </button>

                );

              })}

            </div>

          </div>

        </>

      ) : (

        <div className="results-card">

          <div className="result-icon">

            {certUnlocked ? "🏆" : "📚"}

          </div>

          <h1>

            {certUnlocked
              ? "Congratulations!"
              : "Nice Try!"}

          </h1>

          <p className="score-value">

            {score} / {quiz.length}

          </p>

          <div className="score-circle">

            {Math.round(
              (score / quiz.length) * 100
            )}
            %

          </div>

          {certUnlocked ? (

            <>

              <p className="success-text">

                🎉 You passed the assessment and
                unlocked your certificate!

              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  navigate(`/certificate/${course.id}`)
                }
              >

                View Certificate

              </button>

            </>

          ) : (

            <>

              <p className="fail-text">

                Keep learning and give it another shot.
                You're closer than you think!

              </p>

              <button
                className="secondary-btn"
                onClick={restartQuiz}
              >

                Retake Quiz

              </button>

            </>

          )}

          <button
            className="dashboard-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >

            Back to Dashboard

          </button>

        </div>

      )}

    </div>
  );

};

export default Quiz;











  
