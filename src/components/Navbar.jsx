// import { Link } from "react-router-dom";
// import logo from "/websitelogo2.png";

import { aggregateFieldEqual } from "firebase/firestore";

// export default function Navbar() {
//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         <img src={logo} alt="Logo" className="logo" />
//         <Link to="/">Home</Link>
//         <Link to="/music">Music</Link>
//       </div>
//       {/* <div className="nav-right">
//         <Link to="/">Home</Link>
//         <Link to="/music">Music</Link>
//       </div> */}
//     </nav>
//   );
// }


import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "/websitelogo2.png";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/music", label: "Music" },
  { to: "/projects", label: "Projects" },
  { to: "/sites", label: "Cool Sites" },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pillStyle, setPillStyle] = useState({});
  const [hoverIndex, setHoverIndex] = useState(null);
  const linkRefs = useRef([]);

  // Shrink/shadow the navbar slightly once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIndex = LINKS.findIndex((l) => l.to === location.pathname);
  const targetIndex = hoverIndex !== null ? hoverIndex : activeIndex;

  // Measure the active/hovered link so the gradient pill can slide under it
  useLayoutEffect(() => {
    const node = linkRefs.current[targetIndex];
    if (node) {
      setPillStyle({ left: node.offsetLeft, width: node.offsetWidth });
    }
  }, [targetIndex, menuOpen]);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-left">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <button
        className="nav-toggle"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div
        className={`nav-links ${menuOpen ? "open" : ""}`}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {targetIndex !== -1 && (
          <span className="nav-pill" style={pillStyle} />
        )}
        {LINKS.map((link, i) => (
          <Link
            key={link.to}
            ref={(el) => (linkRefs.current[i] = el)}
            to={link.to}
            className={location.pathname === link.to ? "active" : ""}
            onMouseEnter={() => setHoverIndex(i)}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}