import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

// ===== Highlight Component =====
const HighlightText = ({ text, highlight }) => {
  if (!highlight) return <>{text}</>;

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="highlight">
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

  // ===== Check login =====
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="home-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <h2 className="logo">BLMS</h2>
          <a href="#home">Home</a>
          <a href="#courses">Courses</a>
          <a href="#company">Company</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-center">
          <input
            type="text"
            placeholder="Search the page..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="nav-right">
          <div
            className="profile"
            onClick={() => setOpenProfile(!openProfile)}
          >
            <div className="profile-icon">👤</div>
            <span>{user.name}</span>
          </div>

          {openProfile && (
            <div className="profile-dropdown">
              <Link to="/edit-profile">Edit Profile</Link>
              <Link to="#">Request Demo</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/announcements">Announcements</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-left">
          <h1>
            <HighlightText
              text={`Welcome, ${user.name} 👋`}
              highlight={searchTerm}
            />
          </h1>
          <p>
            <HighlightText
              text="Your personalized learning journey starts here. Explore courses, track progress, and grow your skills with BLMS."
              highlight={searchTerm}
            />
          </p>
        </div>

        <div className="hero-right"></div>
      </section>

      {/* COURSES */}
      <section className="section" id="courses">
        <h2>
          <HighlightText text="Our Popular Courses" highlight={searchTerm} />
        </h2>
        <p>
          <HighlightText
            text="At BLMS, we offer expertly crafted courses designed to equip learners with real-world skills. From Full Stack Web Development to Data Science, Cloud Computing, and DevOps, our curriculum combines practical projects, interactive lessons, and up-to-date industry tools."
            highlight={searchTerm}
          />
        </p>
        <div className="cards">
          <div className="card">
            <h3>
              <HighlightText
                text="Full Stack Web Development"
                highlight={searchTerm}
              />
            </h3>
            <p>
              <HighlightText
                text="Learn HTML, CSS, JavaScript, React, Node.js, and databases."
                highlight={searchTerm}
              />
            </p>
            <div className="course-stats">
              <div className="course-stat">
                <span className="course-icon">⭐</span>
                <span>
                  <HighlightText text="4.7 Rating" highlight={searchTerm} />
                </span>
              </div>
              <div className="course-stat">
                <span className="course-icon">⏱️</span>
                <span>
                  <HighlightText text="12 Weeks" highlight={searchTerm} />
                </span>
              </div>
              <div className="course-stat">
                <span className="course-icon">👨‍🎓</span>
                <span>
                  <HighlightText
                    text="3,500 Learners"
                    highlight={searchTerm}
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>
              <HighlightText text="Data Science & AI" highlight={searchTerm} />
            </h3>
            <p>
              <HighlightText
                text="Python, Machine Learning, AI projects, and data analysis."
                highlight={searchTerm}
              />
            </p>
            <div className="course-stats">
              <div className="course-stat">
                <span className="course-icon">⭐</span>
                <span>
                  <HighlightText text="4.8 Rating" highlight={searchTerm} />
                </span>
              </div>
              <div className="course-stat">
                <span className="course-icon">⏱️</span>
                <span>
                  <HighlightText text="14 Weeks" highlight={searchTerm} />
                </span>
              </div>
              <div className="course-stat">
                <span className="course-icon">👨‍🎓</span>
                <span>
                  <HighlightText
                    text="4,200 Learners"
                    highlight={searchTerm}
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>
              <HighlightText text="Cloud & DevOps" highlight={searchTerm} />
            </h3>
            <p>
              <HighlightText
                text="Learn AWS, Docker, Kubernetes, and CI/CD pipelines."
                highlight={searchTerm}
              />
            </p>
            <div className="course-stats">
              <div className="course-stat">
                <span className="course-icon">⭐</span>
                <span>
                  <HighlightText text="4.6 Rating" highlight={searchTerm} />
                </span>
              </div>
              <div className="course-stat">
                <span className="course-icon">⏱️</span>
                <span>
                  <HighlightText text="10 Weeks" highlight={searchTerm} />
                </span>
              </div>
              <div className="course-stat">
                <span className="course-icon">👨‍🎓</span>
                <span>
                  <HighlightText
                    text="2,800 Learners"
                    highlight={searchTerm}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <button className="view-more" onClick={() => navigate("/courses")}>View More Courses</button>
      </section>

      {/* COMPANY */}
      <section className="section" id="company">
        <h2>
          <HighlightText text="About BLMS" highlight={searchTerm} />
        </h2>
        <p>
          <HighlightText
            text="BLMS is a modern Learning Management System helping learners and professionals advance their skills. Our platform offers a wide range of courses created by industry experts, with interactive tools to track your progress."
            highlight={searchTerm}
          />
        </p>

        <div className="company-stats">
          <div className="stat">
            <span className="stat-icon">⭐</span>
            <span>
              <HighlightText text="4.8 Rating" highlight={searchTerm} />
            </span>
          </div>
          <div className="stat">
            <span className="stat-icon">📚</span>
            <span>
              <HighlightText text="120 Courses" highlight={searchTerm} />
            </span>
          </div>
          <div className="stat">
            <span className="stat-icon">👨‍🎓</span>
            <span>
              <HighlightText text="15,000 Learners" highlight={searchTerm} />
            </span>
          </div>
          <div className="stat">
            <span className="stat-icon">🌐</span>
            <span>
              <HighlightText text="Global Reach" highlight={searchTerm} />
            </span>
          </div>
          <div className="stat">
            <span className="stat-icon">💼</span>
            <span>
              <HighlightText text="Expert Instructors" highlight={searchTerm} />
            </span>
          </div>
        </div>

      </section>

      {/* CONTACT */}
      <section className="section" id="contact">
        <h2>
          <HighlightText text="Contact Us" highlight={searchTerm} />
        </h2>
        <div className="contact-grid">
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <span className="contact-info">
              <HighlightText text="support@blms.com" highlight={searchTerm} />
            </span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📱</span>
            <span className="contact-info">
              <HighlightText text="+91 1234567890" highlight={searchTerm} />
            </span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📸</span>
            <span className="contact-info">
              <HighlightText text="@blms_official" highlight={searchTerm} />
            </span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <span className="contact-info">
              <HighlightText
                text="123 Learning St, Tech City, India"
                highlight={searchTerm}
              />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
