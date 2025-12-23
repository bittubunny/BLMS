import { useEffect, useState } from "react";
import "./Add_Course.css";

const MAX_DESC_LENGTH = 200;
const COURSE_KEY = "courses";
const ANNOUNCEMENT_KEY = "announcements";

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
  const [quiz, setQuiz] = useState({
    question: "",
    options: "",
    answer: "",
  });

  const [announcement, setAnnouncement] = useState({
    title: "",
    message: "",
    type: "update",
  });

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    const storedCourses =
      JSON.parse(localStorage.getItem(COURSE_KEY)) || [];
    setCourses(storedCourses);

    if (localStorage.getItem("isAdmin") === "true") {
      setAuth(true);
    }
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

  /* ---------- ADD COURSE ---------- */
  const addCourse = () => {
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

    const updatedCourses = [
      ...courses,
      {
        ...course,
        id: Date.now(),
      },
    ];

    setCourses(updatedCourses);
    localStorage.setItem(
      COURSE_KEY,
      JSON.stringify(updatedCourses)
    );

    /* 🔔 AUTO ANNOUNCEMENT FOR NEW COURSE */
    const existingAnnouncements =
      JSON.parse(
        localStorage.getItem(ANNOUNCEMENT_KEY)
      ) || [];

    existingAnnouncements.push({
      id: Date.now(),
      title: "New Course Launched 🚀",
      message: `We have launched a new course: "${course.title}". Check it out now!`,
      type: "course",
      createdAt: Date.now(),
    });

    localStorage.setItem(
      ANNOUNCEMENT_KEY,
      JSON.stringify(existingAnnouncements)
    );

    setCourse({
      title: "",
      description: "",
      duration: "",
      image: "",
      topics: [],
      quiz: [],
    });

    alert("Course added successfully!");
  };

  /* ---------- REMOVE COURSE ---------- */
  const removeCourse = (id) => {
    const updatedCourses = courses.filter(
      (c) => c.id !== id
    );
    setCourses(updatedCourses);
    localStorage.setItem(
      COURSE_KEY,
      JSON.stringify(updatedCourses)
    );
  };

  /* ---------- ADD TOPIC ---------- */
  const addTopic = () => {
    if (!topic.title || !topic.content) return;

    setCourse({
      ...course,
      topics: [...course.topics, topic],
    });

    setTopic({ title: "", content: "" });
  };

  /* ---------- ADD QUIZ ---------- */
  const addQuiz = () => {
    if (
      !quiz.question ||
      !quiz.options ||
      !quiz.answer
    )
      return;

    const formattedQuiz = {
      question: quiz.question,
      options: quiz.options
        .split(",")
        .map((o) => o.trim()),
      answer: quiz.answer,
    };

    setCourse({
      ...course,
      quiz: [...course.quiz, formattedQuiz],
    });

    setQuiz({
      question: "",
      options: "",
      answer: "",
    });
  };

  /* ---------- ADD ANNOUNCEMENT ---------- */
  const addAnnouncement = () => {
    if (!announcement.title || !announcement.message) {
      alert("Fill all announcement fields");
      return;
    }

    const existing =
      JSON.parse(
        localStorage.getItem(ANNOUNCEMENT_KEY)
      ) || [];

    const updated = [
      ...existing,
      {
        ...announcement,
        id: Date.now(),
        createdAt: Date.now(),
      },
    ];

    localStorage.setItem(
      ANNOUNCEMENT_KEY,
      JSON.stringify(updated)
    );

    setAnnouncement({
      title: "",
      message: "",
      type: "update",
    });

    alert("Announcement published!");
  };

  /* ---------- ADMIN LOGIN UI ---------- */
  if (!auth) {
    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        <input
          placeholder="Username"
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />
        <button onClick={loginAdmin}>
          Login
        </button>
      </div>
    );
  }

  /* ---------- MAIN UI ---------- */
  return (
    <div className="add-course">
      <h2>Add Course</h2>

      <input
        placeholder="Course Title"
        value={course.title}
        onChange={(e) =>
          setCourse({
            ...course,
            title: e.target.value,
          })
        }
      />

      <input
        placeholder="Duration (e.g. 12 Weeks)"
        value={course.duration}
        onChange={(e) =>
          setCourse({
            ...course,
            duration: e.target.value,
          })
        }
      />

      <input
        placeholder="Image URL"
        value={course.image}
        onChange={(e) =>
          setCourse({
            ...course,
            image: e.target.value,
          })
        }
      />

      <textarea
        placeholder="Course Description"
        maxLength={MAX_DESC_LENGTH}
        value={course.description}
        onChange={(e) =>
          setCourse({
            ...course,
            description: e.target.value,
          })
        }
      />

      <p className="char-count">
        {course.description.length}/
        {MAX_DESC_LENGTH}
      </p>

      {/* ---------- TOPICS ---------- */}
      <h3>Add Topics</h3>

      <input
        placeholder="Topic Title"
        value={topic.title}
        onChange={(e) =>
          setTopic({
            ...topic,
            title: e.target.value,
          })
        }
      />

      <textarea
        placeholder="Topic Content"
        value={topic.content}
        onChange={(e) =>
          setTopic({
            ...topic,
            content: e.target.value,
          })
        }
      />

      <button onClick={addTopic}>
        Add Topic
      </button>

      {/* ---------- QUIZ ---------- */}
      <h3>Add Quiz Questions</h3>

      <input
        placeholder="Question"
        value={quiz.question}
        onChange={(e) =>
          setQuiz({
            ...quiz,
            question: e.target.value,
          })
        }
      />

      <input
        placeholder="Options (comma separated)"
        value={quiz.options}
        onChange={(e) =>
          setQuiz({
            ...quiz,
            options: e.target.value,
          })
        }
      />

      <input
        placeholder="Correct Answer"
        value={quiz.answer}
        onChange={(e) =>
          setQuiz({
            ...quiz,
            answer: e.target.value,
          })
        }
      />

      <button onClick={addQuiz}>
        Add Quiz Question
      </button>

      <button
        className="add-course-btn"
        onClick={addCourse}
      >
        Add Course
      </button>

      {/* ---------- ANNOUNCEMENTS ---------- */}
      <h2>Post Announcement</h2>

      <input
        placeholder="Announcement Title"
        value={announcement.title}
        onChange={(e) =>
          setAnnouncement({
            ...announcement,
            title: e.target.value,
          })
        }
      />

      <textarea
        placeholder="Announcement message"
        value={announcement.message}
        onChange={(e) =>
          setAnnouncement({
            ...announcement,
            message: e.target.value,
          })
        }
      />

      <select
        value={announcement.type}
        onChange={(e) =>
          setAnnouncement({
            ...announcement,
            type: e.target.value,
          })
        }
      >
        <option value="update">
          Platform Update
        </option>
        <option value="course">
          New Course
        </option>
        <option value="news">News</option>
      </select>

      <button
        className="add-course-btn"
        onClick={addAnnouncement}
      >
        Publish Announcement
      </button>

      {/* ---------- EXISTING COURSES ---------- */}
      <h3>Existing Courses</h3>

      {courses.length === 0 && (
        <p>No courses added yet</p>
      )}

      {courses.map((c) => (
        <div
          className="admin-course-item"
          key={c.id}
        >
          <div>
            <strong>{c.title}</strong>
            <p>{c.duration}</p>
            <p>
              {c.topics.length} Topics |{" "}
              {c.quiz.length} Quiz Questions
            </p>
          </div>
          <button
            className="remove-btn"
            onClick={() => removeCourse(c.id)}
          >
            ❌ Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default AddCourse;
