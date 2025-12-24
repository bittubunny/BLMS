import { useEffect, useState } from "react";
import "./Add_Course.css";

const MAX_DESC_LENGTH = 200;
const API_BASE = "https://blms-fnj5.onrender.com"; // backend URL

const AddCourse = () => {
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

  /* ---------- FETCH COURSES FROM BACKEND ---------- */
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE}/courses`);
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
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
    setCourse({ ...course, topics: [...course.topics, { ...topic }] });
    setTopic({ title: "", content: "" });
  };

  /* ---------- ADD QUIZ ---------- */
  const addQuiz = () => {
    if (!quiz.question || !quiz.options || !quiz.answer) return;
    const formattedQuiz = {
      question: quiz.question,
      options: quiz.options.split(",").map((o) => o.trim()),
      answer: quiz.answer,
    };
    setCourse({ ...course, quiz: [...course.quiz, formattedQuiz] });
    setQuiz({ question: "", options: "", answer: "" });
  };

  /* ---------- ADD COURSE TO BACKEND ---------- */
  const addCourse = async () => {
    if (!course.title || !course.description || !course.duration) {
      alert("Please fill all required fields");
      return;
    }
    if (course.description.length > MAX_DESC_LENGTH) {
      alert(`Description must be under ${MAX_DESC_LENGTH} characters`);
      return;
    }
    if (course.topics.length === 0) {
      alert("Add at least one topic");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });

      if (!res.ok) throw new Error("Failed to add course");
      const data = await res.json();

      alert(`Course "${data.course.title}" added successfully!`);

      // Reset course form
      setCourse({ title: "", description: "", duration: "", image: "", topics: [], quiz: [] });

      // Refetch all courses from backend
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Error adding course");
    }
  };

  /* ---------- REMOVE COURSE ---------- */
  const removeCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await fetch(`${API_BASE}/courses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete course");
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Error deleting course");
    }
  };

  /* ---------- RENDER UI ---------- */
  if (!auth) {
    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={loginAdmin}>Login</button>
      </div>
    );
  }

  return (
    <div className="add-course">
      <h2>Add Course</h2>
      <input placeholder="Course Title" value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} />
      <input placeholder="Duration" value={course.duration} onChange={(e) => setCourse({ ...course, duration: e.target.value })} />
      <input placeholder="Image URL" value={course.image} onChange={(e) => setCourse({ ...course, image: e.target.value })} />
      <textarea placeholder="Course Description" maxLength={MAX_DESC_LENGTH} value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} />
      <p className="char-count">{course.description.length}/{MAX_DESC_LENGTH}</p>

      <h3>Add Topics</h3>
      <input placeholder="Topic Title" value={topic.title} onChange={(e) => setTopic({ ...topic, title: e.target.value })} />
      <textarea placeholder="Topic Content" value={topic.content} onChange={(e) => setTopic({ ...topic, content: e.target.value })} />
      <button onClick={addTopic}>Add Topic</button>

      <h3>Add Quiz Questions</h3>
      <input placeholder="Question" value={quiz.question} onChange={(e) => setQuiz({ ...quiz, question: e.target.value })} />
      <input placeholder="Options (comma separated)" value={quiz.options} onChange={(e) => setQuiz({ ...quiz, options: e.target.value })} />
      <input placeholder="Correct Answer" value={quiz.answer} onChange={(e) => setQuiz({ ...quiz, answer: e.target.value })} />
      <button onClick={addQuiz}>Add Quiz Question</button>

      <button className="add-course-btn" onClick={addCourse}>Add Course</button>

      <h3>Existing Courses</h3>
      {courses.length === 0 && <p>No courses added yet</p>}
      {courses.map((c) => (
        <div className="admin-course-item" key={c.id}>
          <div>
            <strong>{c.title}</strong>
            <p>{c.duration}</p>
            <p>{c.topics.length} Topics | {c.quiz.length} Quiz Questions</p>
          </div>
          <button className="remove-btn" onClick={() => removeCourse(c.id)}>❌ Remove</button>
        </div>
      ))}
    </div>
  );
};

export default AddCourse;
