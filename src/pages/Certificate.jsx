import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "./Certificate.css";

const Certificate = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <h2>Please login to view the certificate</h2>;

  const progress = JSON.parse(
    localStorage.getItem(`progress-${user.email}`)
  );

  const courseProgress = progress?.courses?.[id];
  const cert = progress?.certificates?.[id];

  const passed = courseProgress?.quizPassed;

  if (!cert) return <h2>Certificate not found</h2>;

const download = () => {
  if (!passed) return;

  const pdf = new jsPDF("landscape", "mm", "a4"); // A4 landscape
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Background
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // Watermark
  pdf.setTextColor(220);
  pdf.setFontSize(80);
  pdf.setFont("helvetica", "bold");
  pdf.text("BLMS", pageWidth / 2, pageHeight / 2, {
    align: "center",
    angle: 30,
  });

  // Outer border
  pdf.setDrawColor(25, 118, 210);
  pdf.setLineWidth(2);
  pdf.roundedRect(10, 10, pageWidth - 20, pageHeight - 20, 15, 15, "S");

  // Title
  pdf.setTextColor("#1976d2");
  pdf.setFontSize(32);
  pdf.setFont("helvetica", "bold");
  pdf.text("Certificate of Completion", pageWidth / 2, 40, { align: "center" });

  // Subtitle
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor("#333");
  pdf.text("This certifies that", pageWidth / 2, 65, { align: "center" });

  // User Name
  pdf.setFontSize(26);
  pdf.setFont("helvetica", "bold");
  pdf.text(user.name, pageWidth / 2, 85, { align: "center" });

  // Completion line
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "normal");
  pdf.text("has successfully completed the course", pageWidth / 2, 105, { align: "center" });

  // Course Title
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text(cert.courseTitle, pageWidth / 2, 125, { align: "center" });

  // Verification ID & Date
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Verification ID: ${cert.verificationId}`, 20, pageHeight - 30);
  pdf.text(`Issued On: ${new Date(cert.issuedAt).toDateString()}`, 20, pageHeight - 20);

  // Footer
  pdf.setFontSize(12);
  pdf.text("Powered by BLMS", pageWidth / 2, pageHeight - 15, { align: "center" });

  // Save PDF
  pdf.save(`Certificate-${cert.courseTitle}.pdf`);
};


  return (
    <div className="certificate">
      <div className="certificate-content">
        <span className="watermark">BLMS</span>

        <h1>Certificate of Completion</h1>
        <p>This certifies that</p>
        <h2>{user.name}</h2>
        <p>has successfully completed</p>
        <h3>{cert.courseTitle}</h3>

        <p className="verify">
          Verification ID: <strong>{cert.verificationId}</strong>
        </p>

        {passed ? (
          <button onClick={download}>Download PDF</button>
        ) : (
          <p className="certificate-locked">
            ❌ Certificate Locked. Score 60% or higher to unlock.
          </p>
        )}
      </div>
    </div>
  );
};

export default Certificate;
