import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ open, toggle, onClose }) => {
    return (
        <div className="layout">
            <Navbar toggle={toggle} />

            {open && (
                <button
                    type="button"
                    className="sidebar-overlay"
                    aria-label="Close menu"
                    onClick={onClose}
                />
            )}

            <div className="app-container">
                <Sidebar open={open} onClose={onClose} />

                <main className={open ? "main" : "main full"}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
