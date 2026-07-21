import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import ProjectDetailModal from "./ProjectDetailModal";

// Initial seed sample projects based on Figma mockup
const SEED_PROJECTS = [
  {
    id: "seed-fridgebuddy",
    isSeed: true,
    title: "FridgeBuddy",
    dateRange: "2025",
    description:
      "A full-stack cooking app built to assist you in the kitchen. Available on your mobile device or as a web app, FridgeBuddy keeps track of what's in your fridge, what recipes you have saved, and how many ingredients you're missing for what you plan to cook!",
    skills: ["Java", "React", "TypeScript", "SQL"],
    imageUrl: null,
    link: null,
  },
  {
    id: "seed-moodlist",
    isSeed: true,
    title: "MoodList",
    dateRange: "2025",
    description:
      "A personalized music recommendation app designed to curate playlists based on your current emotional state, listening habits, and aesthetic preferences. Connects directly with external streaming platforms for seamless playback.",
    skills: ["React", "JavaScript", "CSS3", "Firebase"],
    imageUrl: null,
    link: null,
  },
];

export default function ProjectList({ refresh }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    // Build Firestore query ordered by creation date newest first
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const dbData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProjects(dbData);
        } else {
          // Fallback to seed projects if collection is empty
          setProjects(SEED_PROJECTS);
        }
      },
      (err) => {
        console.warn("Firestore projects listener error, using seed data:", err);
        setProjects(SEED_PROJECTS);
      }
    );

    return () => unsubscribe();
  }, [refresh]);

  return (
    <>
      <div className="project-list">
        {projects.map((project, index) => {
          const isReverse = index % 2 === 1; // Alternate layout: even = image left, odd = image right
          const skillsList = Array.isArray(project.skills)
            ? project.skills
            : typeof project.skills === "string"
            ? project.skills.split(",").map((s) => s.trim())
            : [];

          return (
            <div
              key={project.id}
              className={`project-card ${isReverse ? "project-card-reverse" : ""}`}
              onClick={() => setSelectedProject(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedProject(project);
                }
              }}
            >
              <div className="project-card-image-box">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={`${project.title} screenshot`}
                    className="project-card-image"
                  />
                ) : (
                  <div className="project-card-image-placeholder">
                    <span>💻</span>
                    <small>{project.title}</small>
                  </div>
                )}
              </div>

              <div className="project-card-content">
                <div className="project-card-header">
                  <h3>
                    {project.title} {project.dateRange && `— ${project.dateRange}`}
                  </h3>
                </div>

                <p className="project-card-description">{project.description}</p>

                {skillsList.length > 0 && (
                  <div className="project-card-skills">
                    <span className="skills-label">Skills:</span>
                    <div className="skills-tags">
                      {skillsList.map((skill, i) => (
                        <span key={i} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Project ↗
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
