import { useState } from "react";
import SitePostModal from "../components/SitePostModal";
import SiteList from "../components/SiteList";
import useScrollReveal from "../hooks/useScrollReveal";

export default function Sites() {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const listRef = useScrollReveal();

  const handlePost = () => {
    setRefresh((prev) => prev + 1);
    setShowModal(false);
  };

  return (
    <div className="sites-page-wrapper">
      {/* Decorative Turquoise Vector Flourish Background Accents */}
      <div className="vector-flourish flourish-top-right flourish-turquoise" aria-hidden="true">
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 220 C 100 140, 140 100, 220 20"
            stroke="rgba(255, 255, 255, 0.65)"
            strokeWidth="3.5"
          />
          <path
            d="M60 220 C 120 160, 160 120, 220 60"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <circle cx="220" cy="20" r="12" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2.5" />
          <circle cx="220" cy="20" r="6" fill="rgba(255, 255, 255, 0.6)" />
          <circle cx="180" cy="60" r="16" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
          <circle cx="180" cy="60" r="8" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" />
          <circle cx="140" cy="100" r="10" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="vector-flourish flourish-bottom-left flourish-turquoise" aria-hidden="true">
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 20 Q 120 80 220 220"
            stroke="rgba(255, 255, 255, 0.55)"
            strokeWidth="3"
          />
          <circle cx="120" cy="80" r="14" fill="none" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2" />
          <circle cx="160" cy="140" r="9" fill="none" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="container sites-container">
        <div className="sites-hero">
          <div className="curved-title-container">
            <svg
              className="curved-title-svg"
              viewBox="0 0 500 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="text-arch-path-sites"
                d="M 40 90 Q 250 20 460 90"
                fill="transparent"
              />
              <text className="curved-title-text text-turquoise-title">
                <textPath
                  href="#text-arch-path-sites"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  Cool Sites & Discoveries ✦
                </textPath>
              </text>
            </svg>
            <p className="sites-subtitle">
              Cool corners of the web, neat tools, and web art I've found!
            </p>
          </div>

          <button
            className="add-site-hero-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Site
          </button>
        </div>

        {showModal && (
          <SitePostModal
            onClose={() => setShowModal(false)}
            onPost={handlePost}
          />
        )}

        <div className="reveal" ref={listRef}>
          <SiteList refresh={refresh} onOpenPostModal={() => setShowModal(true)} />
        </div>
      </div>
    </div>
  );
}
