import { Link } from "react-router-dom";
import logo from "/websitelogo2.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="Logo" className="logo" />
        <Link to="/">Home</Link>
        <Link to="/music">Music</Link>
      </div>
      {/* <div className="nav-right">
        <Link to="/">Home</Link>
        <Link to="/music">Music</Link>
      </div> */}
    </nav>
  );
}
