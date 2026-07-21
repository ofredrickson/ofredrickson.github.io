import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Modal from "./Modal";

export default function SitePostModal({ onClose, onPost }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let formattedLink = link.trim();
    if (formattedLink && !/^https?:\/\//i.test(formattedLink)) {
      formattedLink = "https://" + formattedLink;
    }

    const siteData = {
      name,
      link: formattedLink,
      description,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "sites"), siteData);
      onPost(siteData);
      onClose();
    } catch (err) {
      console.error("Error adding site to Firestore:", err);
      alert(`Firestore Error: ${err.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="site-post-modal">
        <h2>Add a Cool Site</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Site Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Last.fm or The Pudding"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Website Link / URL</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="e.g. https://pudding.cool"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why do you love this website? What makes it cool?"
              rows={4}
              required
            />
          </div>

          <div className="button-row">
            <button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "+ Add Site"}
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
