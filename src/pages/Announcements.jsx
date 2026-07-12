import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Announcements.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Announcements = () => {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  const fetchJobs = async () => {
    try {

      const res = await fetch(`${API_BASE}/jobs`);

      if (!res.ok) throw new Error();

      const data = await res.json();

      data.sort((a,b)=>b.createdAt-a.createdAt);

      setJobs(data);

    } catch {

      setJobs([]);

    }
  };

  useEffect(()=>{

    fetchJobs();

    window.addEventListener("focus",fetchJobs);

    return ()=>window.removeEventListener("focus",fetchJobs);

  },[]);

  const filteredJobs = useMemo(()=>{

    return jobs.filter(job=>

      job.title.toLowerCase().includes(search.toLowerCase()) ||

      job.company.toLowerCase().includes(search.toLowerCase())

    );

  },[jobs,search]);

  return(

    <div className="announcements-page">

      <div className="job-header">

        <div>

          <h1>💼 Career Opportunities</h1>

          <p>
            Explore the latest opportunities from top companies.
          </p>

        </div>

        <button
          className="home-btn"
          onClick={()=>navigate("/home")}
        >
          🏠 Home
        </button>

      </div>

      <div className="job-stats">

        <div className="job-stat-card">

          <h2>{jobs.length}</h2>

          <p>Total Jobs</p>

        </div>

        <div className="job-stat-card">

          <h2>{filteredJobs.length}</h2>

          <p>Showing</p>

        </div>

      </div>

      <div className="search-container">

        <input
          type="text"
          placeholder="Search by title or company..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

      </div>

      {filteredJobs.length===0 ?(

        <div className="empty-state">

          <div className="empty-icon">
            💼
          </div>

          <h2>No Jobs Found</h2>

          <p>
            There are currently no job opportunities matching your search.
          </p>

        </div>

      ):(
        <div className="jobs-grid">

          {filteredJobs.map(job=>(

            <div
              className="job-card"
              key={job.id}
            >

              <span className="job-tag">
                JOB
              </span>

              <h2>{job.title}</h2>

              <div className="company-name">

                🏢 {job.company}

              </div>

              <div className="posted-date">

                📅 {new Date(job.createdAt*1000).toDateString()}

              </div>

              <a

                href={job.link}

                target="_blank"

                rel="noreferrer"

                className="apply-btn"

              >

                Apply Now →

              </a>

            </div>

          ))}

        </div>
      )}

    </div>
  );

};

export default Announcements;
