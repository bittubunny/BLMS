import { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

const API_URL = import.meta.env.VITE_API_URL; // Use environment variable

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful. Please login.");
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
      {/* LEFT SIDE – SIGNUP FORM */}
      <div className="auth-left">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Create Account</h2>

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

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

          <button type="submit">Register</button>

          <p className="switch-text">
            Already Registered? <Link to="/">Login</Link>
          </p>
        </form>
      </div>

      {/* RIGHT SIDE – BRANDING */}
      <div className="auth-right">
        <h1>BLMS</h1>
        <p>Learning Journey For Everyone</p>
      </div>
    </div>
  );
};

export default Signup;
