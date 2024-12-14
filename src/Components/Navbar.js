import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext} from "react";
import noteContext from '../context/notes/noteContext';

const Navbar = () => {
  const { authToken, logout } = useContext(noteContext); // Import logout from context
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Do you want to logout?")) {
      logout();
      navigate("/login"); // Redirect to login page
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">iNoteBook</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
            </li>
          </ul>
          <div className="d-flex">
            {authToken ? (
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link className="btn btn-primary mx-2" to="/login">Login</Link>
                <Link className="btn btn-primary" to="/signup">Signup</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
