import { useEffect, useState } from "react";
import "./Users.css";

const API_BASE = "https://blms-fnj5.onrender.com";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

    // 🔄 Live updates every 5 seconds
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="users-page">
      <h1>👤 Users Database</h1>

      {loading ? (
        <p className="loading">Loading users...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="empty">No users found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
