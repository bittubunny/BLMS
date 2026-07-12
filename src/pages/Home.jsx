import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaEnvelope
} from "react-icons/fa";

// =======================
// Highlight Component
// =======================

const HighlightText = ({ text, highlight }) => {
  if (!highlight) return <>{text}</>;

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="highlight">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

const Home = () => {
  const navigate = useNavigate();

  // Existing state
  const [user, setUser] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // NEW
  const API_BASE = "https://blms-fnj5.onrender.com";

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  // Existing function
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // NEW
  const handleContactChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    setSending(true);
    setStatus("");

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");

        setContactData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setStatus(data.message);
      }
    } catch {
      setStatus("Something went wrong.");
    }

    setSending(false);
  };

  if (!user) return null;

  return (
    <div className="home-container">
      ...

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="nav-left">

          <h2 className="logo">
            BLMS
          </h2>

          <a href="#home">Home</a>
          <a href="#courses">Courses</a>
          <a href="#company">About</a>
          <a href="#contact">Contact</a>

        </div>

        <div className="nav-center">

          <input
            type="text"
            placeholder="Search Courses, Skills, Jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

        <div className="nav-right">

          <div
            className="profile"
            onClick={() => setOpenProfile(!openProfile)}
          >
<div className="profile-icon">
  {user.name.charAt(0).toUpperCase()}
</div>

            <span>{user.name}</span>
          </div>

        {openProfile && (

  <div className="profile-dropdown">

    <Link to="/profile">
      👤 My Profile
    </Link>

    <Link to="/dashboard">
      📊 Dashboard
    </Link>

    <Link to="/announcements">
      💼 Job Portal
    </Link>

    <button onClick={handleLogout}>
      🚪 Logout
    </button>

  </div>

)}

        </div>

      </nav>

      {/* ================= HERO ================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-left">

          <span className="hero-badge">
            🚀 Welcome Back
          </span>

          <h1>

            <HighlightText
              text={`Hello ${user.name}!`}
              highlight={searchTerm}
            />

          </h1>

          <h2>
            Continue building your future,
            one lesson at a time.
          </h2>

          <p>

            <HighlightText
              text="Your learning journey is waiting. Explore new courses, master valuable skills, earn certificates, and unlock exciting career opportunities with BLMS."
              highlight={searchTerm}
            />

          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/courses")}
            >
              Explore Courses
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/dashboard")}
            >
              My Dashboard
            </button>

          </div>

        </div>

        <div className="hero-right">

          <div className="floating-card card-one">
            📚
          </div>

          <div className="floating-card card-two">
            🏆
          </div>

          <div className="floating-card card-three">
            💡
          </div>

          <div className="floating-card card-four">
            🚀
          </div>

          <div className="hero-circle">

            <div className="circle-text">
              BLMS
            </div>

          </div>

        </div>

      </section>

      {/* ================= QUICK STATS ================= */}

      <section className="quick-stats">

        <div className="stat-card">
          <h2>120+</h2>
          <p>Courses</p>
        </div>

        <div className="stat-card">
          <h2>15K+</h2>
          <p>Learners</p>
        </div>

        <div className="stat-card">
          <h2>96%</h2>
          <p>Completion Rate</p>
        </div>

        <div className="stat-card">
          <h2>24/7</h2>
          <p>Learning Access</p>
        </div>

      </section>

      {/* ================= DAILY MOTIVATION ================= */}

      <section className="motivation">

        <h2>💡 Daily Motivation</h2>

        <p>

          "The beautiful thing about learning is that nobody can take it away from you."

        </p>

      </section>

      {/* ================= POPULAR COURSES ================= */}

      <section className="section" id="courses">

        <h2>🔥 Popular Courses</h2>

        <p>
          Explore our most popular learning paths and start building skills
          that matter.
        </p>

        <div className="cards">

          <div className="card">
            <div className="course-icon-large">🤖</div>

            <h3>
              <HighlightText
                text="Artificial Intelligence"
                highlight={searchTerm}
              />
            </h3>

            <p>
              Learn machine learning, neural networks, deep learning and modern
              AI development.
            </p>

            <div className="course-footer">
              <span>⭐ 4.9</span>
              <span>48 Lessons</span>
            </div>
          </div>

          <div className="card">
            <div className="course-icon-large">💻</div>

            <h3>
              <HighlightText
                text="Full Stack Development"
                highlight={searchTerm}
              />
            </h3>

            <p>
              Become a modern web developer using React, Flask, SQL and REST
              APIs.
            </p>

            <div className="course-footer">
              <span>⭐ 4.8</span>
              <span>60 Lessons</span>
            </div>
          </div>

          <div className="card">
            <div className="course-icon-large">📊</div>

            <h3>
              <HighlightText
                text="Data Science"
                highlight={searchTerm}
              />
            </h3>

            <p>
              Learn Python, Pandas, NumPy, visualization and predictive
              analytics.
            </p>

            <div className="course-footer">
              <span>⭐ 4.9</span>
              <span>52 Lessons</span>
            </div>
          </div>

        </div>

        <button
          className="view-more"
          onClick={() => navigate("/courses")}
        >
          View All Courses →
        </button>

      </section>

      {/* ================= LEARNING CATEGORIES ================= */}

      <section className="section">

        <h2>🎯 Explore Categories</h2>

        <div className="category-grid">

          <div className="category-card">
            🤖
            <span>Artificial Intelligence</span>
          </div>

          <div className="category-card">
            🌐
            <span>Web Development</span>
          </div>

          <div className="category-card">
            ☁️
            <span>Cloud Computing</span>
          </div>

          <div className="category-card">
            🔐
            <span>Cyber Security</span>
          </div>

          <div className="category-card">
            📈
            <span>Data Science</span>
          </div>

          <div className="category-card">
            📱
            <span>Mobile Apps</span>
          </div>

        </div>

      </section>

      {/* ================= ACHIEVEMENTS ================= */}

      <section className="section">

        <h2>🏆 Achievement Badges</h2>

        <div className="achievement-grid">

          <div className="achievement-item">
            🥇
            <h3>First Course</h3>
            <p>Complete your first course.</p>
          </div>

          <div className="achievement-item">
            🎯
            <h3>Quiz Master</h3>
            <p>Score above 90%.</p>
          </div>

          <div className="achievement-item">
            📚
            <h3>Knowledge Seeker</h3>
            <p>Complete 10 courses.</p>
          </div>

          <div className="achievement-item">
            🚀
            <h3>Future Ready</h3>
            <p>Earn your certificate.</p>
          </div>

        </div>

      </section>

      {/* ================= JOB PORTAL ================= */}

      <section className="section">

        <div className="job-banner">

          <div>

            <h2>💼 Find Your Dream Job</h2>

            <p>
              Browse the latest job opportunities after completing your
              learning journey.
            </p>

          </div>

          <button
            className="view-more"
            onClick={() => navigate("/announcements")}
          >
            Browse Jobs
          </button>

        </div>

      </section>

            {/* ================= ABOUT COMPANY ================= */}


{/* ================= WHY CHOOSE BLMS ================= */}

<section
  className="section"
  id="company"
>

  <h2>🌍 Why Choose BLMS?</h2>

  <p>
    Everything you need to learn, grow, earn certificates,
    and launch your career—all in one platform.
  </p>

  <div className="why-grid">

    <div className="why-card">

      <div className="why-icon">📚</div>

      <h3>Learn</h3>

      <p>
        Access high-quality courses designed to help you master
        real-world skills at your own pace.
      </p>

    </div>

    <div className="why-card">

      <div className="why-icon">🏆</div>

      <h3>Earn</h3>

      <p>
        Receive professional certificates that showcase your
        achievements and boost your resume.
      </p>

    </div>

    <div className="why-card">

      <div className="why-icon">💼</div>

      <h3>Grow</h3>

      <p>
        Explore exciting job opportunities and take the next
        step in your professional journey.
      </p>

    </div>

    <div className="why-card">

      <div className="why-icon">🚀</div>

      <h3>Achieve</h3>

      <p>
        Track your progress, stay motivated, and transform
        your learning into real success.
      </p>

    </div>

  </div>

</section>


      

      {/* ================= CONTACT ================= */}

     <section className="section" id="contact">

<h2>📩 Contact Us</h2>

<p>
Have questions, feedback, or suggestions? We'd love to hear from you.
</p>

<div className="contact-container">

<div className="contact-left">

<h3>Connect With BLMS</h3>

<p>
Follow us on social media and stay updated with the latest courses,
certificates, and career opportunities.
</p>

<a
href="https://instagram.com/"
target="_blank"
rel="noreferrer"
className="social-card"
>
<FaInstagram />
<span>Instagram</span>
</a>

<a
href="https://facebook.com/"
target="_blank"
rel="noreferrer"
className="social-card"
>
<FaFacebookF />
<span>Facebook</span>
</a>

<a
href="https://linkedin.com/"
target="_blank"
rel="noreferrer"
className="social-card"
>
<FaLinkedinIn />
<span>LinkedIn</span>
</a>

<a
href="mailto:chbharath0779@gmail.com"
className="social-card"
>
<FaEnvelope />
<span>Email</span>
</a>

</div>

<div className="contact-right">

<form onSubmit={sendMessage}>

<input
type="text"
placeholder="Your Name"
name="name"
value={contactData.name}
onChange={handleContactChange}
required
/>

<input
type="email"
placeholder="Your Email"
name="email"
value={contactData.email}
onChange={handleContactChange}
required
/>

<input
type="text"
placeholder="Subject"
name="subject"
value={contactData.subject}
onChange={handleContactChange}
required
/>

<textarea
placeholder="Message"
rows="6"
name="message"
value={contactData.message}
onChange={handleContactChange}
required
/>

<button
type="submit"
disabled={sending}
>

{sending ? "Sending..." : "Send Message"}

</button>

{status === "success" && (

<p className="success-text">

✅ Message sent successfully!

</p>

)}

{status &&
status !== "success" && (

<p className="error-text">

{status}

</p>

)}

</form>

</div>

</div>

</section>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="footer-logo">

          🎓 BLMS

        </div>

        <p>

          Learn • Practice • Achieve • Grow

        </p>

        <div className="footer-links">

          <a href="#home">Home</a>

          <a href="#courses">Courses</a>

          <a href="#company">About</a>

          <a href="#contact">Contact</a>

        </div>

        <p className="copyright">

          © {new Date().getFullYear()} BLMS. All Rights Reserved.

        </p>

      </footer>

    </div>
  );
};

export default Home;
      
