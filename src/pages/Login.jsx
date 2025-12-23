import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // Store user
        localStorage.setItem("user", JSON.stringify(data.user));

        // Required for LMS logic
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            username: data.user.name || data.user.email
          })
        );

        alert("Login successful");
        navigate("/home");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>

          <p className="switch-text">
            Register as New User? <Link to="/signup">Signup</Link>
          </p>
        </form>
      </div>

      <div className="auth-right">
        <h1>BLMS</h1>
        <p>Learning Journey For Everyone</p>
      </div>
    </div>
  );
};

export default Login;
