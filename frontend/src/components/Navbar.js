import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">Dashboard</Link>
      <Link to="/categories">Categories</Link>
      <Link to="/topics">Topics</Link>
      <Link to="/logs">Study Logs</Link>
    </nav>
  );
};

export default Navbar;
