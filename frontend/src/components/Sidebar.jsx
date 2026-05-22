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

    return (
        <aside className={open ? "sidebar" : "sidebar closed"}>
            <h3>SmartCampus</h3>
            <p className="role-badge">{user?.role}</p>

            <nav>
                <ul>
                    <li>
                        <NavLink to="/dashboard"
                                 className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                 onClick={handleNavClick}>
                            Dashboard
                        </NavLink>
                    </li>

                    {/* STUDENT LINKS */}
                    {isStudent && (
                        <>
                            <li>
                                <NavLink to="/courses"
                                         className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                         onClick={handleNavClick}>
                                    Courses
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/my-courses"
                                         className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                         onClick={handleNavClick}>
                                    My Classes
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/assignments"
                                         className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                         onClick={handleNavClick}>
                                    Assignments
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/grades"
                                         className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                         onClick={handleNavClick}>
                                    My Grades
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* LECTURER LINKS */}
                    {isStaff && (
                        <>
                            <li>
                                <NavLink to="/courses"
                                         className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                         onClick={handleNavClick}>
                                    My Courses
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/assignments"
                                         className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                         onClick={handleNavClick}>
                                    Assignments & Grading
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* ADMIN LINKS */}
                    {isAdmin && (
                        <li>
                            <NavLink to="/admin"
                                     className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                     onClick={handleNavClick}>
                                Admin Panel
                            </NavLink>
                        </li>
                    )}

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