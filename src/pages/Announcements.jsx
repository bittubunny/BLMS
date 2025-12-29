import { useEffect, useState } from "react";
import "./Announcements.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Announcements = () => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE}/jobs`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();

      data.sort((a, b) => b.createdAt - a.createdAt);
      setJobs(data);
    } catch (err) {
      console.error(err);
      setJobs([]);
    }
  };

  useEffect(() => {
    fetchJobs();
    window.addEventListener("focus", fetchJobs);
    return () => window.removeEventListener("focus", fetchJobs);
  }, []);

  return (
    <div className="announcements-page">
      <h1>💼 Job Openings</h1>

      {jobs.length === 0 && (
        <p className="empty">No job openings yet</p>
      )}

      {jobs.map((job) => (
        <div key={job.id} className="announcement-card">
          <span className="tag job">JOB</span>

          <h3>{job.title}</h3>
          <p><strong>Company:</strong> {job.company}</p>

          <a
            href={job.link}
            target="_blank"
            rel="noreferrer"
            className="job-link"
          >
            Apply Now →
          </a>

          <small>
            Posted on {new Date(job.createdAt * 1000).toDateString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default Announcements;

