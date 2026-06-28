import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar = ({ open, onClose }) => {
    const navigate = useNavigate();
    const { user, isStudent, isStaff, isAdmin } = useAuth();

    const handleNavClick = () => {
        if (window.innerWidth <= 768) onClose?.();
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const link = (to, label) => (
        <li>
            <NavLink
                to={to}
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                onClick={handleNavClick}
            >
                {label}
            </NavLink>
        </li>
    );

    return (
        <aside className={open ? "sidebar" : "sidebar closed"}>
            <h3>SmartCampus</h3>
            <p className="role-badge">{user?.role}</p>

            <nav>
                <ul>
                    {link("/dashboard", "Dashboard")}

                    {isStudent && (
                        <>
                            {link("/join", "+ Join a Class")}
                            {link("/courses", "My Classes")}
                            {link("/assignments", "Assignments")}
                            {link("/grades", "My Grades")}
                        </>
                    )}

                    {isStaff && (
                        <>
                            {link("/courses", "My Courses")}
                            {link("/assignments", "Assignments & Grading")}
                        </>
                    )}

                    {isAdmin && link("/admin", "Admin Panel")}

                    <li>
                        <button type="button" className="nav-link link-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;