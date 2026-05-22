import { FaBars } from "react-icons/fa";

const Navbar = ({ toggle }) => {
    return (
        <div className="navbar">
            <h2>SmartCampus LMS</h2>
            <FaBars
                style={{ cursor: "pointer" }}
                onClick={toggle}
            />
        </div>
    );
};

export default Navbar;
