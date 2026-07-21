import { useState } from "react";
import { db } from "../firebase/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import Modal from "./Modal";

// Helper function to pull album/video art from Spotify or YouTube links
async function fetchCoverFromLink(link) {
  if (!link) return null;

  try {
    if (link.includes("open.spotify.com") || link.includes("spotify.link")) {
      const res = await fetch(
        `https://open.spotify.com/oembed?url=${encodeURIComponent(link)}`
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.thumbnail_url || null;
    }

    if (link.includes("youtube.com") || link.includes("youtu.be")) {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(
          link
        )}&format=json`
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.thumbnail_url || null;
    }
  } catch (err) {
    console.error("Couldn't auto-fetch cover art:", err);
  }

  return null;
}

export default function SongDetailModal({ song, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states initialized with current song values
  const [title, setTitle] = useState(song.title || "");
  const [artist, setArtist] = useState(song.artist || "");
  const [description, setDescription] = useState(song.description || "");
  const [link, setLink] = useState(song.link || "");
  const [coverUrl, setCoverUrl] = useState(song.coverUrl || "");

  const dateString = song.createdAt
    ? song.createdAt.toDate().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Resolve cover art (use manual URL if present, or auto-fetch from link if link changed)
      let resolvedCover = coverUrl.trim();
      if (!resolvedCover && link) {
        resolvedCover = (await fetchCoverFromLink(link)) || null;
      }

      const songRef = doc(db, "songs", song.id);
      await updateDoc(songRef, {
        title,
        artist,
        description,
        link,
        coverUrl: resolvedCover || null,
      });

      setIsEditing(false);
      onClose();
    } catch (err) {
      console.error("Error updating song:", err);
      alert("Failed to update post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const songRef = doc(db, "songs", song.id);
      await deleteDoc(songRef);
      onClose();
    } catch (err) {
      console.error("Error deleting song:", err);
      alert("Failed to delete post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      {isEditing ? (
        <div className="song-detail-edit">
          <h2>Edit Song Post</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-row">
              <div>
                <label className="form-label">Song Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Song Title"
                  required
                />
              </div>
              <div>
                <label className="form-label">Artist</label>
                <input
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Artist"
                  required
                />
              </div>
            </div>

            <label className="form-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={4}
            />

            <label className="form-label">Spotify / YouTube Link</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Link (optional)"
            />

            <label className="form-label">Cover Image URL</label>
            <input
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="Cover image URL (optional)"
            />

            <div className="modal-date-badge">
              <span>Date posted: {dateString}</span> <em>(Date is uneditable)</em>
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
        <div className="song-detail-delete-confirm">
          <h2>Delete Song Post?</h2>
          <p>
            Are you sure you want to delete <strong>"{song.title}"</strong>? This
            action cannot be undone.
          </p>
          <div className="button-row">
            <button
              type="button"
              className="button-danger"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Yes, Delete Post"}
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
        <div className="song-detail-view">
          <div className="song-detail-header">
            {song.coverUrl ? (
              <img
                src={song.coverUrl}
                alt={`${song.title} cover`}
                className="song-detail-cover"
              />
            ) : (
              <div className="song-detail-cover-placeholder">🎵</div>
            )}
            <div className="song-detail-meta">
              <h2>{song.title}</h2>
              <h3 className="song-detail-artist">by {song.artist}</h3>
              <span className="song-date">Posted on {dateString}</span>
            </div>
          </div>

          {song.description && (
            <div className="song-detail-description">
              <p>{song.description}</p>
            </div>
          )}

          {song.link && (
            <div className="song-detail-link">
              <a
                href={song.link}
                target="_blank"
                rel="noreferrer"
                className="listen-button"
              >
                Listen on External Site ↗
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
                ✏️ Edit Post
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
