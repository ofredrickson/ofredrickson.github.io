import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import SiteDetailModal from "./SiteDetailModal";

const SEED_SITES = [
  {
    id: "seed-lastfm",
    isSeed: true,
    name: "Last.fm",
    link: "https://www.last.fm",
    description:
      "This is a great website used to track your music listening trends. It gives you weekly and year-round music reports similar to Spotify Wrapped, but you get it all year round.",
  },
  {
    id: "seed-thepudding",
    isSeed: true,
    name: "The Pudding",
    link: "https://pudding.cool",
    description:
      "A unique website that analyzes data related to niche topics, and posts interesting visualizations every month.",
  },
];

export default function SiteList({ refresh, onOpenPostModal }) {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "sites"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const dbData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (dbData.length > 0) {
          setSites(dbData);
        } else {
          setSites(SEED_SITES);
        }
      },
      (err) => {
        console.warn("Firestore sites listener error, using seed sites:", err);
        setSites(SEED_SITES);
      }
    );

    return () => unsubscribe();
  }, [refresh]);

  // Size distribution for organic bubble layout
  const sizeClasses = ["bubble-large", "bubble-medium", "bubble-small"];

  return (
    <>
      <div className="bubble-grid">
        {/* Special "+ Add Your Own Site!" Bubble (First bubble like Figma design) */}
        <div
          className="site-bubble bubble-add-site bubble-medium"
          onClick={onOpenPostModal}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpenPostModal();
            }
          }}
          style={{ animationDelay: "0s" }}
        >
          <div className="bubble-inner">
            <h3 className="bubble-title">Add Your Own Site!</h3>
            <button className="bubble-add-btn">+ Add Site</button>
          </div>
        </div>

        {/* Dynamic Floating Site Bubbles */}
        {sites.map((site, index) => {
          const sizeClass = sizeClasses[index % sizeClasses.length];
          const animationDelay = `${(index + 1) * 0.4}s`;

          return (
            <div
              key={site.id}
              className={`site-bubble ${sizeClass}`}
              onClick={() => setSelectedSite(site)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedSite(site);
                }
              }}
              style={{ animationDelay }}
            >
              <div className="bubble-inner">
                <h3 className="bubble-title">{site.name}</h3>
                <p className="bubble-description">{site.description}</p>
                {site.link && (
                  <a
                    href={site.link}
                    target="_blank"
                    rel="noreferrer"
                    className="bubble-link-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Link ↗
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedSite && (
        <SiteDetailModal
          site={selectedSite}
          onClose={() => setSelectedSite(null)}
        />
      )}
    </>
  );
}
