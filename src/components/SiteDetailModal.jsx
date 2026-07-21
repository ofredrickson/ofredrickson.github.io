import { useState } from "react";
import { db } from "../firebase/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import Modal from "./Modal";

export default function SiteDetailModal({ site, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState(site.name || "");
  const [link, setLink] = useState(site.link || "");
  const [description, setDescription] = useState(site.description || "");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let formattedLink = link.trim();
    if (formattedLink && !/^https?:\/\//i.test(formattedLink)) {
      formattedLink = "https://" + formattedLink;
    }

    try {
      if (site.id && !site.isSeed) {
        const siteRef = doc(db, "sites", site.id);
        await updateDoc(siteRef, {
          name,
          link: formattedLink,
          description,
        });
      }
      setIsEditing(false);
      onClose();
    } catch (err) {
      console.error("Error updating site:", err);
      alert(`Failed to update site: ${err.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      if (site.id && !site.isSeed) {
        const siteRef = doc(db, "sites", site.id);
        await deleteDoc(siteRef);
      }
      onClose();
    } catch (err) {
      console.error("Error deleting site:", err);
      alert(`Failed to delete site: ${err.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      {isEditing ? (
        <div className="site-detail-edit">
          <h2>Edit Site</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Site Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Last.fm"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Website Link / URL</label>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                rows={4}
                required
              />
            </div>

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
        <div className="site-detail-delete-confirm">
          <h2>Delete Site Post?</h2>
          <p>
            Are you sure you want to delete <strong>"{site.name}"</strong>? This
            action cannot be undone.
          </p>
          <div className="button-row">
            <button
              type="button"
              className="button-danger"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Yes, Delete Site"}
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
        <div className="site-detail-view">
          <div className="site-detail-header">
            <div className="site-detail-icon">🌐</div>
            <div className="site-detail-meta">
              <h2>{site.name}</h2>
              {site.link && (
                <span className="site-detail-domain">
                  {new URL(site.link.startsWith("http") ? site.link : `https://${site.link}`).hostname}
                </span>
              )}
            </div>
          </div>

          {site.description && (
            <div className="site-detail-description">
              <p>{site.description}</p>
            </div>
          )}

          {site.link && (
            <div className="site-detail-link-box">
              <a
                href={site.link}
                target="_blank"
                rel="noreferrer"
                className="listen-button site-visit-button"
              >
                Visit {site.name} ↗
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
                ✏️ Edit
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
