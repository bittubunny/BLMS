import { useEffect, useState } from "react";
import "./Announcements.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  // Fetch announcements from backend
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE}/announcements`);
      if (!res.ok) throw new Error("Failed to fetch announcements");
      const data = await res.json();

      // Sort latest first
      data.sort((a, b) => b.createdAt - a.createdAt);
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    // Optional: refetch when tab gains focus
    window.addEventListener("focus", fetchAnnouncements);

    return () => {
      window.removeEventListener("focus", fetchAnnouncements);
    };
  }, []);

  return (
    <div className="announcements-page">
      <h1>📢 Announcements</h1>

      {announcements.length === 0 && (
        <p className="empty">No announcements yet</p>
      )}

      {announcements.map((a) => (
        <div key={a.id} className="announcement-card">
          <span className={`tag ${a.type}`}>
            {a.type.toUpperCase()}
          </span>

          <h3>{a.title}</h3>
          <p>{a.message}</p>

          <small>
            {new Date(a.createdAt * 1000).toDateString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default Announcements;
