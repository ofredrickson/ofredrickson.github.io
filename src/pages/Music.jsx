import { useState } from "react";
import SongPostModal from "../components/SongPostModal";
import SongList from "../components/SongList";
import useScrollReveal from "../hooks/useScrollReveal";

export default function Music() {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const listRef = useScrollReveal();

  const handlePost = () => {
    setRefresh((prev) => prev + 1);
    setShowModal(false);
  };

  return (
    <div className="container music-container">
      <div className="music-hero">
        <div>
          <h1>Music Blog</h1>
          <p>What I've been listening to lately &mdash; add your own find!</p>
        </div>
        <button onClick={() => setShowModal(true)}>+ Post a Song</button>
      </div>

      {showModal && (
        <SongPostModal
          onClose={() => setShowModal(false)}
          onPost={handlePost}
        />
      )}

      <div className="reveal" ref={listRef}>
        <SongList refresh={refresh} />
      </div>
    </div>
  );
}