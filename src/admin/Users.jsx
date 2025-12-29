import { useEffect, useMemo, useState } from "react";
import "./Users.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      const data = await res.json();

      // 🔽 newest users first (assuming backend returns in created order)
      const sorted = [...data].reverse();

      setUsers(sorted);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();

    // 🔄 live refresh every 5 seconds
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔍 filter users by name or email
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="users-page">
      <h1>👤 Users Database</h1>

      {/* 🔍 SEARCH BAR */}
      <div className="users-controls">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <span className="count">
          Total Users: {filteredUsers.length}
        </span>
      </div>

      {loading ? (
        <p className="loading">Loading users...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td className="mono">{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <p className="empty">No users found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
