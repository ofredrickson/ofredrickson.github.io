import { useState } from "react";
import SongPostModal from "../components/SongPostModal";
import SongList from "../components/SongList";

export default function Music() {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const handlePost = () => {
    setRefresh((prev) => prev + 1);
    setShowModal(false);
  };

  return (
    <div className="music-container">
      <h1>Music Blog</h1>
      <p>Click here to add a song you've been listening to: <button onClick={() => setShowModal(true)}>Post a Song</button> </p>

      <br></br>

      {showModal && (
        <SongPostModal 
          onClose={() => setShowModal(false)} 
          onPost={handlePost}
        />
      )}

      <SongList refresh={refresh} />
    </div>
  );
}
