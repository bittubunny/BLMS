import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "./Certificate.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Certificate = () => {
  const { id } = useParams(); // course ID
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [passed, setPassed] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/"); // Redirect to login
      return;
    }
    setUser(storedUser);

    const fetchCertificateData = async () => {
      try {
        // 1. Fetch course
        const courseRes = await fetch(`${API_BASE}/courses/${id}`);
        if (!courseRes.ok) throw new Error("Course not found");
        const courseData = await courseRes.json();
        setCourse(courseData);

        // 2. Fetch USER-SPECIFIC progress (now uses correct user.id)
        const progressRes = await fetch(
          `${API_BASE}/progress/${storedUser.id}/${id}`
        );
        if (!progressRes.ok) throw new Error("Progress not found");
        const progressData = await progressRes.json();

        const finalScore = progressData.quiz_results?.final ?? null;
        const totalQuestions = courseData.quiz?.length || 0;

        if (finalScore === null || totalQuestions === 0) {
          setPassed(false);
          return;
        }

        const isPassed = finalScore / totalQuestions >= 0.6;

        setScore(finalScore);
        setPassed(isPassed);
      } catch (err) {
        console.error("Certificate fetch error:", err);
      }
    };

    fetchCertificateData();
  }, [id, navigate]);

  const download = () => {
    if (!passed || !user || !course) return;

    const verificationId = `BLMS-${user.id}-${course.id}`;

    const pdf = new jsPDF("landscape", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();

    // Background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, w, h, "F");

    // Watermark
    pdf.setTextColor(220);
    pdf.setFontSize(80);
    pdf.setFont("helvetica", "bold");
    pdf.text("BLMS", w / 2, h / 2, {
      align: "center",
      angle: 30,
    });

    // Border
    pdf.setDrawColor(25, 118, 210);
    pdf.setLineWidth(2);
    pdf.roundedRect(10, 10, w - 20, h - 20, 15, 15, "S");

    // Title
    pdf.setTextColor("#1976d2");
    pdf.setFontSize(32);
    pdf.setFont("helvetica", "bold");
    pdf.text("Certificate of Completion", w / 2, 40, { align: "center" });

    pdf.setFontSize(16);
    pdf.setTextColor("#333");
    pdf.setFont("helvetica", "normal");
    pdf.text("This certifies that", w / 2, 65, { align: "center" });

    pdf.setFontSize(26);
    pdf.setFont("helvetica", "bold");
    pdf.text(user.name, w / 2, 85, { align: "center" });

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      "has successfully completed the course",
      w / 2,
      105,
      { align: "center" }
    );

    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text(course.title, w / 2, 125, { align: "center" });

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Verification ID: ${verificationId}`, 20, h - 30);
    pdf.text(
      `Issued On: ${new Date().toDateString()}`,
      20,
      h - 20
    );

    pdf.setFontSize(12);
    pdf.text("Powered by BLMS", w / 2, h - 15, { align: "center" });

    pdf.save(`Certificate-${course.title}.pdf`);
  };

  if (!user)
    return <h2 style={{ padding: "40px" }}>Please login</h2>;

  if (!course)
    return <h2 style={{ padding: "40px" }}>Loading certificate...</h2>;

  if (!passed)
    return (
      <h2 style={{ padding: "40px" }}>
        Certificate Locked — score at least 60% to unlock
      </h2>
    );

  return (
    <div className="certificate">
      <div className="certificate-content">
        <span className="watermark">BLMS</span>

        <h1>Certificate of Completion</h1>
        <p>This certifies that</p>
        <h2>{user.name}</h2>
        <p>has successfully completed</p>
        <h3>{course.title}</h3>

        <p className="verify">
          Verification ID:{" "}
          <strong>{`BLMS-${user.id}-${course.id}`}</strong>
        </p>

        <p>
          Score: <strong>{score}</strong> / {course.quiz.length}
        </p>

        <button onClick={download}>Download PDF</button>
        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Certificate;
