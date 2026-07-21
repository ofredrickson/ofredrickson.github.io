import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Modal from "./Modal";

export default function ProjectPostModal({ onClose, onPost }) {
  const [title, setTitle] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const project = {
      title,
      dateRange,
      imageUrl: imageUrl.trim() || null,
      link: link.trim() || null,
      skills: skillsArray,
      description,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "projects"), project);
      onPost(project);
      onClose();
    } catch (err) {
      console.error("Error adding project to Firestore:", err);
      alert(`Firestore Error: ${err.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="project-post-modal">
        <h2>Add a New Project</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. FridgeBuddy"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Start — Completion Date</label>
              <input
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                placeholder="e.g. 2025"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skills / Tech Stack (comma separated)</label>
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Java, React, TypeScript, SQL"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Screenshot / Image URL (optional)</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Link (optional)</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project, technologies used, and key features..."
              rows={4}
              required
            />
          </div>

          <div className="button-row">
            <button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "+ Add Project"}
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
