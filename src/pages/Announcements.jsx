import { useEffect, useState } from "react";
import "./Announcements.css";

const STORAGE_KEY = "announcements";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    // latest first
    setAnnouncements(stored.reverse());
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
            {new Date(a.createdAt).toDateString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default Announcements;
