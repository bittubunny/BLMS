import { useEffect, useState } from "react";
import "./Add_Course.css";

const MAX_DESC_LENGTH = 200;
const API_BASE = "https://blms-fnj5.onrender.com";

const AddCourse = () => {
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /* ================= COURSES ================= */
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState({
    title: "",
    description: "",
    duration: "",
    image: "",
    topics: [],
    quiz: [],
  });

  const [topic, setTopic] = useState({ title: "", content: "" });
  const [quiz, setQuiz] = useState({ question: "", options: "", answer: "" });

  /* ================= JOBS ================= */
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState({
    role: "",
    company: "",
    link: "",
  });

  /* ---------- FETCH COURSES ---------- */
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE}/courses`);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- FETCH JOBS ---------- */
  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE}/jobs`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchJobs();
    if (localStorage.getItem("isAdmin") === "true") setAuth(true);
  }, []);

  /* ---------- ADMIN LOGIN ---------- */
  const loginAdmin = () => {
    if (username === "admin" && password === "admin891") {
      localStorage.setItem("isAdmin", "true");
      setAuth(true);
    } else {
      alert("Invalid admin credentials");
    }
  };

  /* ---------- ADD TOPIC ---------- */
  const addTopic = () => {
    if (!topic.title || !topic.content) return;
    setCourse({ ...course, topics: [...course.topics, topic] });
    setTopic({ title: "", content: "" });
  };

  /* ---------- ADD QUIZ ---------- */
  const addQuiz = () => {
    if (!quiz.question || !quiz.options || !quiz.answer) return;
    setCourse({
      ...course,
      quiz: [
        ...course.quiz,
        {
          question: quiz.question,
          options: quiz.options.split(",").map((o) => o.trim()),
          answer: quiz.answer,
        },
      ],
    });
    setQuiz({ question: "", options: "", answer: "" });
  };

  /* ---------- ADD COURSE ---------- */
  const addCourse = async () => {
    if (!course.title || !course.description || !course.duration) {
      alert("Fill all required fields");
      return;
    }

    await fetch(`${API_BASE}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });

    setCourse({
      title: "",
      description: "",
      duration: "",
      image: "",
      topics: [],
      quiz: [],
    });

    fetchCourses();
  };

  /* ---------- REMOVE COURSE ---------- */
  const removeCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    await fetch(`${API_BASE}/courses/${id}`, { method: "DELETE" });
    fetchCourses();
  };

  /* ---------- ADD JOB ---------- */
  const addJob = async () => {
    if (!job.role || !job.company || !job.link) {
      alert("Fill all job fields");
      return;
    }

    await fetch(`${API_BASE}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });

    setJob({ role: "", company: "", link: "" });
    fetchJobs();
  };

  /* ---------- REMOVE JOB ---------- */
  const removeJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    await fetch(`${API_BASE}/jobs/${id}`, { method: "DELETE" });
    fetchJobs();
  };

  if (!auth) {
    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={loginAdmin}>Login</button>
      </div>
    );
  }

  return (
    <div className="add-course">
      {/* ================= COURSES ================= */}
      <h2>Add Course</h2>

      <input
        placeholder="Course Title"
        value={course.title}
        onChange={(e) => setCourse({ ...course, title: e.target.value })}
      />

      <input
        placeholder="Duration"
        value={course.duration}
        onChange={(e) => setCourse({ ...course, duration: e.target.value })}
      />

      <textarea
        placeholder="Description"
        value={course.description}
        maxLength={MAX_DESC_LENGTH}
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
      />

      <h3>Add Topics</h3>
      <input
        placeholder="Topic Title"
        value={topic.title}
        onChange={(e) => setTopic({ ...topic, title: e.target.value })}
      />
      <textarea
        placeholder="Topic Content"
        value={topic.content}
        onChange={(e) => setTopic({ ...topic, content: e.target.value })}
      />
      <button onClick={addTopic}>Add Topic</button>

      <h3>Add Quiz</h3>
      <input
        placeholder="Question"
        value={quiz.question}
        onChange={(e) => setQuiz({ ...quiz, question: e.target.value })}
      />
      <input
        placeholder="Options (comma separated)"
        value={quiz.options}
        onChange={(e) => setQuiz({ ...quiz, options: e.target.value })}
      />
      <input
        placeholder="Answer"
        value={quiz.answer}
        onChange={(e) => setQuiz({ ...quiz, answer: e.target.value })}
      />
      <button onClick={addQuiz}>Add Quiz</button>

      <button className="add-course-btn" onClick={addCourse}>
        Add Course
      </button>

      <h3>Existing Courses</h3>
      {courses.map((c) => (
        <div key={c.id} className="admin-course-item">
          <strong>{c.title}</strong>
          <button onClick={() => removeCourse(c.id)}>❌</button>
        </div>
      ))}

      <hr />

      {/* ================= JOBS ================= */}
      <h2>Add Job Opening</h2>

      <input
        placeholder="Job Role"
        value={job.role}
        onChange={(e) => setJob({ ...job, role: e.target.value })}
      />

      <input
        placeholder="Company Name"
        value={job.company}
        onChange={(e) => setJob({ ...job, company: e.target.value })}
      />

      <input
        placeholder="Application Link"
        value={job.link}
        onChange={(e) => setJob({ ...job, link: e.target.value })}
      />

      <button onClick={addJob}>Add Job</button>

      <h3>Posted Jobs</h3>
      {jobs.map((j) => (
        <div key={j.id} className="admin-course-item">
          <strong>{j.role} - {j.company}</strong>
          <button onClick={() => removeJob(j.id)}>❌</button>
        </div>
      ))}
    </div>
  );
};

export default AddCourse;
