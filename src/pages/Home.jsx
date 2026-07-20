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
            A little corner of the internet for songs I can't stop
            replaying, sites I think are cool, and things I'm building.
          </p>
        </div>

        {/* right side */}
        <div className="home-right">
          <img src="/me.jpg" alt="Me" className="profile-pic" />
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
          <p>Songs I've been listening to on repeat lately.</p>
        </Link>

        <div className="topic-card">
          {/* <span className="icon">🌐</span> */}
          <h3>Sites I Like</h3>
          <p>Corners of the web worth bookmarking. Coming soon!</p>
        </div>

        <div className="topic-card">
          {/* <span className="icon">🛠️</span> */}
          <h3>Projects</h3>
          <p>Things I'm building, from code to little side quests.</p>
        </div>
      </div>
    </div>
  );
}