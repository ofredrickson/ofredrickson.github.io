export default function Home() {
    return (
      <div className="home-container">
        {/* Left Side */}
        <div className="home-left">
          <h1>Welcome to my blog</h1>
        </div>
  
        {/* Right Side */}
        <div className="home-right">
          <img 
            src="/me.jpg"  // put your photo in `public/me.jpg`
            alt="Me" 
            className="profile-pic"
          />
          <p>
            hi, I’m Olivia! this is my personal blog where I post about music, websites I like, and projects I'm working on.
          </p>
        </div>
      </div>
    );
  }
  