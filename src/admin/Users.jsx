import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Users.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Users = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // newest | az | za

  /* ================= ADMIN PROTECTION ================= */
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      alert("Unauthorized access");
      navigate("/home");
    }
  }, [navigate]);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000); // 🔄 live refresh
    return () => clearInterval(interval);
  }, []);

  /* ================= FILTER + SORT ================= */
  const processedUsers = useMemo(() => {
    let filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (sortOrder === "az") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "za") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      // newest first (fallback using array order)
      filtered = [...filtered].reverse();
    }

    return filtered;
  }, [users, search, sortOrder]);

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const headers = ["ID", "Name", "Email"];
    const rows = processedUsers.map((u) => [u.id, u.name, u.email]);

    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
  };

  return (
    <div className="users-page">
      <h1>👤 Users Database</h1>

      {/* ================= CONTROLS ================= */}
      <div className="users-controls">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="az">Name A–Z</option>
          <option value="za">Name Z–A</option>
        </select>

        <button className="export-btn" onClick={exportCSV}>
          Export CSV
        </button>

        <span className="count">
          Total Users: {processedUsers.length}
        </span>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p className="loading">Loading users...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>

            <tbody>
              {processedUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td className="mono">{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {processedUsers.length === 0 && (
            <p className="empty">No users found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
