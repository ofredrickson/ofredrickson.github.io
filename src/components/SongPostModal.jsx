import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Modal from "./Modal";

// pulls album/video art from a link automatically where possible.
// Spotify and YouTube both expose a public oEmbed endpoint that
// returns a thumbnail_url w/ no API key or login needed.
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
    // network problem or CORS block fail quietly, manual field still works
    console.error("Couldn't auto-fetch cover art:", err);
  }

  return null;
}

export default function SongPostModal({ onClose, onPost }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [coverUrl, setCoverUrl] = useState(""); // manual override/fallback
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // manual cover field wins if the user filled it in; otherwise try
    // to auto-fetch one from the Spotify/YouTube link.
    const resolvedCover = coverUrl.trim() || (await fetchCoverFromLink(link));

    const song = {
      title,
      artist,
      description,
      link,
      coverUrl: resolvedCover || null,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "songs"), song);
      onPost(song); // update UI immediately
      onClose();
    } catch (err) {
      console.error("Error posting song:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2>Post a Song</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Song Title"
            required
          />
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist"
            required
          />
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="YouTube/Spotify Link"
        />
        <p className="field-hint">
          album art pulls automatically from Spotify/YouTube links 
        </p>

        <input
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          placeholder="Cover image URL (optional — only needed if auto-fetch can't find one)"
        />

        <div className="button-row">
          <button type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Post"}
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}