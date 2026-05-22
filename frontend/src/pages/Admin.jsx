import { useEffect, useState } from "react";
import API from "../services/api";

const Admin = () => {
    const [users, setUsers] = useState([]);

    const loadUsers = () => {
        API.get("/users")
            .then((res) => setUsers(res.data))
            .catch(console.error);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const changeRole = async (userId, role) => {
        try {
            await API.patch(`/users/${userId}/role`, { role });
            alert("Role updated");
            loadUsers();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update role");
        }
    };

    return (
        <div className="page-content">
            <h1>Admin Panel</h1>
            <p className="subtitle">Manage users and approve lecturers</p>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.fullName}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>
                                <select
                                    value={u.role}
                                    onChange={(e) => changeRole(u.id, e.target.value)}
                                >
                                    <option value="student">student</option>
                                    <option value="lecturer">lecturer</option>
                                    <option value="admin">admin</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
