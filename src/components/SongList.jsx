import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function SongList({ refresh }) {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const querySnapshot = await getDocs(collection(db, "songs"));
      setSongs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchSongs();
  }, [refresh]); // re-fetch whenever refresh changes

  return (
    <div className="song-list">
      {songs.map(song => (
        <div key={song.id} className="song-card">
          <h3>{song.title} — {song.artist}</h3>
          <p>{song.description}</p>
          {song.link && (
            <a href={song.link} target="_blank" rel="noreferrer">
              Listen
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
