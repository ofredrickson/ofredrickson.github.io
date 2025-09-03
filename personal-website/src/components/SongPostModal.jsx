import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function SongPostModal({ onClose, onPost }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const song = { title, artist, description, link };

    try {
      await addDoc(collection(db, "songs"), song);
      onPost(song); //do i keep "song" inside the parenthesis // update UI immediately
      onClose();
    } catch (err) {
      console.error("Error posting song:", err);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Post a Song</h2>
        <form onSubmit={handleSubmit}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Song Title" required />
          <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Artist" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="YouTube/Spotify Link" />

          <button type="submit">Post</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
