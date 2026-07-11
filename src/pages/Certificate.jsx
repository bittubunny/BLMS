import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "./Certificate.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Certificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [passed, setPassed] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/");
      return;
    }

    setUser(storedUser);

    const fetchCertificateData = async () => {
      try {
        // Fetch Course
        const courseRes = await fetch(`${API_BASE}/courses/${id}`);

        if (!courseRes.ok)
          throw new Error("Course not found");

        const courseData = await courseRes.json();

        setCourse(courseData);

        // Fetch Progress
        const progressRes = await fetch(
          `${API_BASE}/progress/${storedUser.id}/${id}`
        );

        if (!progressRes.ok)
          throw new Error("Progress not found");

        const progressData = await progressRes.json();

        const finalScore =
          progressData.quiz_results?.final ?? null;

        const totalQuestions =
          courseData.quiz?.length || 0;

        if (
          finalScore === null ||
          totalQuestions === 0
        ) {
          setPassed(false);
          return;
        }

        const isPassed =
          finalScore / totalQuestions >= 0.6;

        setScore(finalScore);
        setPassed(isPassed);

      } catch (err) {
        console.error(err);
      }
    };

    fetchCertificateData();

  }, [id, navigate]);

  const verificationId = user && course
    ? `BLMS-${user.id.substring(0, 8).toUpperCase()}-${course.id
        .substring(0, 8)
        .toUpperCase()}`
    : "";

  const issueDate = new Date().toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const percentage =
    course?.quiz?.length
      ? Math.round((score / course.quiz.length) * 100)
      : 0;

  /* =====================================================
     PDF DOWNLOAD
  ===================================================== */

  const download = () => {
    if (!passed || !user || !course) return;

    const pdf = new jsPDF(
      "landscape",
      "mm",
      "a4"
    );

    const width =
      pdf.internal.pageSize.getWidth();

    const height =
      pdf.internal.pageSize.getHeight();

    /* Background */

    pdf.setFillColor(250, 252, 255);

    pdf.rect(0, 0, width, height, "F");

    /* Border */

    pdf.setDrawColor(37, 99, 235);
    pdf.setLineWidth(2);

    pdf.roundedRect(
      10,
      10,
      width - 20,
      height - 20,
      8,
      8
    );

    /* Watermark */

    pdf.setFontSize(70);
    pdf.setTextColor(235);

    pdf.text(
      "BLMS",
      width / 2,
      height / 2,
      {
        align: "center",
        angle: 25,
      }
    );

    /* Title */

    pdf.setFontSize(30);
    pdf.setTextColor(37, 99, 235);
    pdf.setFont("helvetica", "bold");

    pdf.text(
      "Certificate of Completion",
      width / 2,
      35,
      {
        align: "center",
      }
    );

    /* Subtitle */

    pdf.setFontSize(16);
    pdf.setTextColor(80);

    pdf.text(
      "This certificate is proudly presented to",
      width / 2,
      55,
      {
        align: "center",
      }
    );

    /* Name */

    pdf.setFontSize(28);
    pdf.setTextColor(20);
    pdf.setFont("helvetica", "bold");

    pdf.text(
      user.name,
      width / 2,
      78,
      {
        align: "center",
      }
    );

    /* Description */

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");

    pdf.text(
      "For successfully completing the course",
      width / 2,
      96,
      {
        align: "center",
      }
    );

    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");

    pdf.text(
      course.title,
      width / 2,
      114,
      {
        align: "center",
      }
    );

    /* Footer */

    pdf.setFontSize(12);

    pdf.setTextColor(80);

    pdf.text(
      `Score : ${score}/${course.quiz.length} (${percentage}%)`,
      20,
      height - 32
    );

    pdf.text(
      `Verification ID : ${verificationId}`,
      20,
      height - 22
    );

    pdf.text(
      `Issued : ${issueDate}`,
      width - 70,
      height - 22
    );

    pdf.text(
      "BLMS Learning Management System",
      width / 2,
      height - 12,
      {
        align: "center",
      }
    );

    pdf.save(
      `${course.title}-Certificate.pdf`
    );
  };

  /* =====================================================
     STATES
  ===================================================== */

  if (!user)
    return <h2 style={{ padding: "40px" }}>Please login</h2>;

  if (!course)
    return (
      <h2 style={{ padding: "40px" }}>
        Loading certificate...
      </h2>
    );

  if (!passed)
    return (
      <div className="certificate-locked-page">

        <div className="locked-card">

          <div className="locked-icon">🔒</div>

          <h2>Certificate Locked</h2>

          <p>
            Score at least <strong>60%</strong> in the
            final assessment to unlock your
            certificate.
          </p>

          <button
            onClick={() =>
              navigate(`/quiz/${course.id}`)
            }
          >
            Retake Quiz
          </button>

        </div>

      </div>
    );




  return (
    <div className="certificate-page">

      <div className="certificate-card">

        {/* ===================== VERIFIED RIBBON ===================== */}

        <div className="verified-ribbon">
          ★ VERIFIED
        </div>

        {/* ===================== WATERMARK ===================== */}

        <div className="certificate-watermark">
          BLMS
        </div>

        {/* ===================== HEADER ===================== */}

        <div className="certificate-header">

          <div className="certificate-icon">
            🏆
          </div>

          <h1>Certificate of Achievement</h1>

          <p>
            This certificate is proudly presented to
          </p>

        </div>

        {/* ===================== STUDENT ===================== */}

        <div className="student-name">

          {user.name}

        </div>

        <p className="completion-text">

          for successfully completing the course

        </p>

        <div className="course-name">

          {course.title}

        </div>

        {/* ===================== SCORE ===================== */}

        <div className="score-section">

          <div className="score-circle">

            <span>{percentage}%</span>

          </div>

          <div className="score-info">

            <h3>Excellent Performance</h3>

            <p>

              Final Score

              <strong>
                {" "}
                {score} / {course.quiz.length}
              </strong>

            </p>

          </div>

        </div>

        {/* ===================== INFO GRID ===================== */}

        <div className="certificate-info">

          <div className="info-card">

            <span className="info-title">

              Verification ID

            </span>

            <strong>

              {verificationId}

            </strong>

          </div>

          <div className="info-card">

            <span className="info-title">

              Issued On

            </span>

            <strong>

              {issueDate}

            </strong>

          </div>

        </div>

        {/* ===================== SIGNATURES ===================== */}

        <div className="signature-section">

          <div className="signature">

            <div className="signature-line"></div>

            <strong>Instructor</strong>

          </div>

          <div className="gold-seal">

            ★

            <span>

              CERTIFIED

            </span>

          </div>

          <div className="signature">

            <div className="signature-line"></div>

            <strong>BLMS</strong>

          </div>

        </div>

        {/* ===================== BUTTONS ===================== */}

        <div className="certificate-actions">

          <button
            className="download-btn"
            onClick={download}
          >

            ⬇ Download Certificate

          </button>

          <button
            className="dashboard-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >

            🏠 Dashboard

          </button>

        </div>

      </div>

    </div>
  );

};

export default Certificate;














  
