import "./navbar.css";
import logo from "../assets/cube-logo.png";
import { FiBell, FiMoon, FiUser } from "react-icons/fi";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Dono ko import kiya

const Navbar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Home");
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown toggle state

  // LocalStorage se check karenge ki user logged in hai ya guest hai
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const navItems = ["Home", "Tools", "Templates", "Pricing"];

  const handleLogout = () => {
    localStorage.removeItem("userInfo"); // Data saaf
    setDropdownOpen(false);
    navigate("/login"); // Wapas login page par bhej diya
  };

  return (
    <header className="navbar">
      <div className="logo-section" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" />
        <div className="logo-text">
          <h2>AL-Editor</h2>
          <span>Smart PDF Editor</span>
        </div>
      </div>

      <div className="navbar-center">
        {navItems.map((item) => (
          <button
            key={item}
            className={activeTab === item ? "nav-link active" : "nav-link"}
            onClick={() => setActiveTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="navbar-right">
        <button className="icon-btn">
          <FiMoon />
        </button>

        <button className="icon-btn">
          <FiBell />
        </button>

        {/* --- PROFILE CONTAINER WITH DROPDOWN --- */}
        <div className="profile-container">
          <div className="profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <FiUser />
          </div>

          {dropdownOpen && (
            <div className="profile-dropdown">
              {user ? (
                <>
                  {/* Jab user logged in ho */}
                  <div className="dropdown-header">
                    <p className="user-name">Hey, {user.name} 👋</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    My Saved PDFs
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Jab user normal guest ho */}
                  <div className="dropdown-header">
                    <p className="guest-title">Want to save your history?</p>
                  </div>
                  <Link to="/login" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Login
                  </Link>
                  <Link to="/signup" className="dropdown-item signup-link" onClick={() => setDropdownOpen(false)}>
                    Create Account
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
        {/* --- END --- */}
      </div>
    </header>
  );
};

export default Navbar;