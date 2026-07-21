import { Link } from "react-router-dom";
import useScrollReveal from "../hooks/useScrollReveal";

export default function Home() {
  const gridRef = useScrollReveal();

  return (
    <div className="container">
      <div className="home-container">
        {/* left side */}
        <div className="home-left">
          <span className="eyebrow">✦ personal blog ✦</span>
          <h1>Welcome to my blog</h1>
          <p className="tagline">
            This is where I post about my interests, my current projects,
            and whatever else I find interesting!
          </p>
        </div>

        {/* right side */}
        <div className="home-right">
          <img src="/me.jpeg" alt="Me" className="profile-pic" />
          <p>
            hi, I'm Olivia! this is my personal blog where I post about
            music, websites I like, and projects I'm working on.
          </p>
        </div>
      </div>

      <div className="topic-grid reveal" ref={gridRef}>
        <Link to="/music" className="topic-card">
          {/* <span className="icon">🎧</span> */}
          <h3>Music</h3>
          <p>songs I've been listening to on repeat lately.</p>
        </Link>

        <div className="topic-card">
          {/* <span className="icon">🌐</span> */}
          <h3>Sites I Like</h3>
          <p>coming soon: a section to post about cool websites i found </p>
        </div>

        <Link to="/projects" className="topic-card">
          {/* <span className="icon">🛠️</span> */}
          <h3>Projects</h3>
          <p>my past and present projects</p>
        </Link>
      </div>
    </div>
  );
}