import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

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

  const [user, setUser] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="home-container">

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
              👤
            </div>

            <span>{user.name}</span>
          </div>

          {openProfile && (

            <div className="profile-dropdown">

              <Link to="/edit-profile">
                Edit Profile
              </Link>

              <Link to="/dashboard">
                Dashboard
              </Link>

              <Link to="/announcements">
                Job Portal
              </Link>

              <button onClick={handleLogout}>
                Logout
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

      <section
        className="section"
        id="company"
      >

        <h2>🌍 About BLMS</h2>

        <p>
          BLMS (Basic Learning Management System) is designed to make learning
          simple, engaging and career-focused. From beginner-friendly lessons
          to advanced skill development, our platform empowers students to
          learn at their own pace while preparing for real-world opportunities.
        </p>

        <div className="company-stats">

          <div className="stat">
            <div className="stat-icon">🎓</div>

            <div>
              <h3>120+</h3>
              <p>Courses Available</p>
            </div>
          </div>

          <div className="stat">
            <div className="stat-icon">👨‍🎓</div>

            <div>
              <h3>15,000+</h3>
              <p>Active Learners</p>
            </div>
          </div>

          <div className="stat">
            <div className="stat-icon">🏆</div>

            <div>
              <h3>8,000+</h3>
              <p>Certificates Issued</p>
            </div>
          </div>

          <div className="stat">
            <div className="stat-icon">💼</div>

            <div>
              <h3>500+</h3>
              <p>Career Opportunities</p>
            </div>
          </div>

        </div>

      </section>

      {/* ================= CONTACT ================= */}

      <section
        className="section"
        id="contact"
      >

        <h2>📞 Contact Us</h2>

        <p>
          We'd love to hear from you. Reach out anytime.
        </p>

        <div className="contact-grid">

          <div className="contact-item">

            <div className="contact-icon">
              📧
            </div>

            <div>

              <h3>Email</h3>

              <div className="contact-info">
                support@blms.com
              </div>

            </div>

          </div>

          <div className="contact-item">

            <div className="contact-icon">
              📞
            </div>

            <div>

              <h3>Phone</h3>

              <div className="contact-info">
                +91 98765 43210
              </div>

            </div>

          </div>

          <div className="contact-item">

            <div className="contact-icon">
              📍
            </div>

            <div>

              <h3>Address</h3>

              <div className="contact-info">
                Hyderabad, Telangana
              </div>

            </div>

          </div>

          <div className="contact-item">

            <div className="contact-icon">
              🌐
            </div>

            <div>

              <h3>Website</h3>

              <div className="contact-info">
                www.blms.com
              </div>

            </div>

          </div>

        </div>

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
      
