import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import SongDetailModal from "./SongDetailModal";

export default function SongList({ refresh }) {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    // build firestore query ordered by newest first
    const q = query(collection(db, "songs"), orderBy("createdAt", "desc"));

    // real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const songData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSongs(songData);
      // update selectedSong if currently open and modified in database
      setSelectedSong((prev) => {
        if (!prev) return null;
        return songData.find((s) => s.id === prev.id) || null;
      });
    });

    return () => unsubscribe();
  }, [refresh]);

  if (songs.length === 0) {
    return (
      <div className="empty-state">
        no songs posted yet &mdash; be the first! 🎶
      </div>
    );
  }

  return (
    <>
      <div className="song-list">
        {songs.map((song) => {
          const dateString = song.createdAt
            ? song.createdAt.toDate().toLocaleDateString()
            : "—"; // fallback for older posts
          return (
            <div
              key={song.id}
              className="song-card"
              onClick={() => setSelectedSong(song)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedSong(song);
                }
              }}
            >
              <div className="song-card-header">
                {song.coverUrl ? (
                  <img
                    src={song.coverUrl}
                    alt={`${song.title} cover`}
                    className="song-cover"
                  />
                ) : (
                  <div className="song-cover-placeholder">🎵</div>
                )}

                <div className="song-header-info">
                  <div className="song-title-row">
                    <h3>{song.title}</h3>
                    <span className="song-date">{dateString}</span>
                  </div>
                  <div className="song-artist">by {song.artist}</div>
                </div>
              </div>

              <div className="song-card-body">
                {song.description && <p>{song.description}</p>}

                {song.link && (
                  <a
                    href={song.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Listen ↗
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedSong && (
        <SongDetailModal
          song={selectedSong}
          onClose={() => setSelectedSong(null)}
        />
      )}
    </>
  );
}