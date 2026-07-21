import { useState } from "react";
import { db } from "../firebase/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import Modal from "./Modal";

export default function ProjectDetailModal({ project, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states pre-populated with current project values
  const [title, setTitle] = useState(project.title || "");
  const [dateRange, setDateRange] = useState(project.dateRange || "");
  const [imageUrl, setImageUrl] = useState(project.imageUrl || "");
  const [link, setLink] = useState(project.link || "");
  const [skills, setSkills] = useState(
    Array.isArray(project.skills)
      ? project.skills.join(", ")
      : project.skills || ""
  );
  const [description, setDescription] = useState(project.description || "");

  // Convert comma-separated string to clean array of skills
  const parseSkills = (input) => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    return input
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // If it's a seed fallback project without a Firestore ID, doc update fails gracefully
      if (project.id && !project.isSeed) {
        const projectRef = doc(db, "projects", project.id);
        await updateDoc(projectRef, {
          title,
          dateRange,
          imageUrl: imageUrl.trim() || null,
          link: link.trim() || null,
          skills: parseSkills(skills),
          description,
        });
      }
      setIsEditing(false);
      onClose();
    } catch (err) {
      console.error("Error updating project:", err);
      alert("Failed to update project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      if (project.id && !project.isSeed) {
        const projectRef = doc(db, "projects", project.id);
        await deleteDoc(projectRef);
      }
      onClose();
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const skillsList = parseSkills(project.skills);

  return (
    <Modal onClose={onClose}>
      {isEditing ? (
        <div className="project-detail-edit">
          <h2>Edit Project</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-row">
              <div>
                <label className="form-label">Project Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. FridgeBuddy"
                  required
                />
              </div>
              <div>
                <label className="form-label">Start — Completion Date</label>
                <input
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  placeholder="e.g. 2025 or 2024 - 2025"
                  required
                />
              </div>
            </div>

            <label className="form-label">Skills / Tech Stack (comma separated)</label>
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Java, React, TypeScript, SQL"
            />

            <label className="form-label">Screenshot / Image URL</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />

            <label className="form-label">Project Link (optional)</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://github.com/..."
            />

            <label className="form-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project, technologies used, and key features..."
              rows={4}
            />

            <div className="button-row">
              <button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => setIsEditing(false)}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : isDeleting ? (
        <div className="project-detail-delete-confirm">
          <h2>Delete Project?</h2>
          <p>
            Are you sure you want to delete <strong>"{project.title}"</strong>?
            This action cannot be undone.
          </p>
          <div className="button-row">
            <button
              type="button"
              className="button-danger"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Yes, Delete Project"}
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={() => setIsDeleting(false)}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="project-detail-view">
          <div className="project-detail-header">
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={`${project.title} screenshot`}
                className="project-detail-image"
              />
            ) : (
              <div className="project-detail-image-placeholder">💻</div>
            )}
            <div className="project-detail-meta">
              <h2>
                {project.title} {project.dateRange && `— ${project.dateRange}`}
              </h2>

              {skillsList.length > 0 && (
                <div className="project-skills-row">
                  <strong>Skills:</strong>
                  <div className="skills-tags">
                    {skillsList.map((skill, i) => (
                      <span key={i} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {project.description && (
            <div className="project-detail-description">
              <p>{project.description}</p>
            </div>
          )}

          {project.link && (
            <div className="project-detail-link">
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="listen-button"
              >
                View Live Project / Repository ↗
              </a>
            </div>
          )}

          <div className="modal-actions-bar">
            <div className="action-buttons-group">
              <button
                type="button"
                className="button-edit"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Project
              </button>
              <button
                type="button"
                className="button-delete"
                onClick={() => setIsDeleting(true)}
              >
                🗑️ Delete
              </button>
            </div>
            <button
              type="button"
              className="button-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
