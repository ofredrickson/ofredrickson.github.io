import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Modal from "./Modal";

export default function SongPostModal({ onClose, onPost }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const song = { title, artist, description, link, createdAt: serverTimestamp() };

    try {
      await addDoc(collection(db, "songs"), song);
      onPost(song); // update UI immediately
      onClose();
    } catch (err) {
      console.error("Error posting song:", err);
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

      <div className="button-row">
        <button type="submit">Post</button> 
        <button type="button" onClick={onClose}>Cancel</button>
      </div>

      </form> 
    </Modal> 
    );

}
