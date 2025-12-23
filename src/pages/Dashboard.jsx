import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <h2>Please login to view dashboard</h2>;

  const progress =
    JSON.parse(localStorage.getItem(`progress-${user.email}`)) || {
      courses: {},
      certificates: {},
    };

  const profile =
    JSON.parse(localStorage.getItem(`profile-${user.email}`)) || {};

  const coursesData = JSON.parse(localStorage.getItem("courses")) || [];

  // Helper to get course title by ID
  const getCourseTitle = (id) => {
    const course = coursesData.find((c) => c.id === Number(id));
    return course ? course.title : `Course ${id}`;
  };

  return (
    <div className="dashboard">
      {/* Welcome */}
      <h1>Welcome, {user.name}</h1>

      {/* Profile Section */}
      <div className="profile-section">
        <h2>Your Profile</h2>
        {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
        {profile.gender && <p><strong>Gender:</strong> {profile.gender}</p>}
        {profile.country && <p><strong>Country:</strong> {profile.country}</p>}
        {profile.state && <p><strong>State:</strong> {profile.state}</p>}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <div>
            <strong>Social Links:</strong>
            <ul>
              {profile.socialLinks.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noreferrer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          className="edit-profile-btn"
          onClick={() => navigate("/edit-profile")}
        >
          Edit Profile
        </button>
      </div>

      {/* Courses Section */}
      <h2>Completed Courses</h2>
      {Object.keys(progress.courses).length === 0 && <p>No courses yet</p>}

      {Object.entries(progress.courses).map(([cid, data]) => (
        <div key={cid} className="dash-card">
          <div>
            <p>
              Course: <strong>{getCourseTitle(cid)}</strong>
            </p>
            <p>
              Score: {data.quizScore} / {data.totalQuestions}
            </p>
          </div>
          <div>
            {progress.certificates[cid] ? (
              <Link to={`/certificate/${cid}`}>View Certificate</Link>
            ) : (
              <span>Certificate Locked</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
