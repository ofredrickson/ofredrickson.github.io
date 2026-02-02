import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, orderBy, onSnapshot, getDocs } from "firebase/firestore";

export default function SongList({ refresh }) {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    //build firestory query ordered by newest first
    const q = query(
      collection(db, "songs"),
      orderBy("createdAt", "desc")
    );

    // Real-time listener 
    const unsubscribe = onSnapshot(q, (snapshot) => { 
      const songData = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data(), })); setSongs(songData); }); 
      
        return () => unsubscribe(); 
    }, [refresh]);


return ( 
  <div className="song-list"> 
    {songs.map((song) => { 
      const dateString = song.createdAt 
      ? song.createdAt.toDate().toLocaleDateString() 
      : "—"; // fallback for older posts 
      return ( 
        <div key={song.id} className="song-card"> 
          <div className="song-header"> 
            <h3>{song.title} — {song.artist}</h3> 
            <span className="song-date">{dateString}</span> 
          </div> 
          
          <p>{song.description}</p> 
          
          {song.link && ( 
            <a href={song.link} target="_blank" rel="noreferrer"> 
            Listen 
            </a> 
          )} 
        </div> 
      ); 
    })}
  </div> 
  );
}
