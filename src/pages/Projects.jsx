import { useState } from "react";
import ProjectPostModal from "../components/ProjectPostModal";
import ProjectList from "../components/ProjectList";
import useScrollReveal from "../hooks/useScrollReveal";

export default function Projects() {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const listRef = useScrollReveal();

  const handlePost = () => {
    setRefresh((prev) => prev + 1);
    setShowModal(false);
  };

  return (
    <div className="projects-page-wrapper">
      {/* Decorative Vector Flourish Line Art Background Accents */}
      <div className="vector-flourish flourish-top-left" aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 180 C 60 100, 100 60, 180 20"
            stroke="rgba(122, 175, 45, 0.35)"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
          <circle cx="180" cy="20" r="6" fill="rgba(122, 175, 45, 0.4)" />
          <circle cx="150" cy="40" r="4" fill="rgba(122, 175, 45, 0.3)" />
          <circle cx="120" cy="65" r="3" fill="rgba(122, 175, 45, 0.25)" />
          {/* Cherry Blossom / Flower Vector Accents */}
          <g transform="translate(40, 100) scale(0.6)">
            <path
              d="M20 0 C25 10 35 10 40 0 C35 -10 25 -10 20 0 Z"
              fill="rgba(142, 195, 55, 0.35)"
            />
            <path
              d="M20 0 C30 5 30 15 20 20 C10 15 10 5 20 0 Z"
              fill="rgba(142, 195, 55, 0.35)"
            />
            <path
              d="M20 0 C15 -10 5 -10 0 0 C5 10 15 10 20 0 Z"
              fill="rgba(142, 195, 55, 0.35)"
            />
            <path
              d="M20 0 C10 -5 10 -15 20 -20 C30 -15 30 -5 20 0 Z"
              fill="rgba(142, 195, 55, 0.35)"
            />
          </g>
        </svg>
      </div>

      <div className="vector-flourish flourish-top-right" aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 20 C 80 60, 120 100, 180 180"
            stroke="rgba(122, 175, 45, 0.35)"
            strokeWidth="3"
          />
          <circle cx="80" cy="60" r="8" fill="none" stroke="rgba(122, 175, 45, 0.4)" strokeWidth="2" />
          <circle cx="110" cy="90" r="5" fill="none" stroke="rgba(122, 175, 45, 0.3)" strokeWidth="2" />
        </svg>
      </div>

      <div className="container projects-container">
        <div className="projects-hero">
          <div className="curved-title-container">
            {/* Arched SVG Text on a Path */}
            <svg
              className="curved-title-svg"
              viewBox="0 0 500 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="text-arch-path"
                d="M 40 90 Q 250 20 460 90"
                fill="transparent"
              />
              <text className="curved-title-text">
                <textPath
                  href="#text-arch-path"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  My Portfolio & Projects ✦
                </textPath>
              </text>
            </svg>
            <p className="projects-subtitle">
              A collection of web apps, tools, and creations I've built!
            </p>
          </div>

          <button
            className="add-project-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Project
          </button>
        </div>

        {showModal && (
          <ProjectPostModal
            onClose={() => setShowModal(false)}
            onPost={handlePost}
          />
        )}

        <div className="reveal" ref={listRef}>
          <ProjectList refresh={refresh} />
        </div>
      </div>
    </div>
  );
}
