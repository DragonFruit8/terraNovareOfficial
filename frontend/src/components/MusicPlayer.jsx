import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axios.config";
import "../MusicPlayer.css"; // CSS file for styling

const MusicPlayer = () => {
  const [musicFiles, setMusicFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackError, setPlaybackError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2); // Starts low, fades to 45%
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [renameFields, setRenameFields] = useState({});
  const [editingFile, setEditingFile] = useState(null);
  const audioRef = useRef(null);
  const BASE_URL = "https://terranovare.tech/api/music/";

  useEffect(() => {
    fetchMusicFiles();
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isPlaying) audioRef.current.play();
    else audioRef.current.pause();
  }, [isPlaying, currentIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
      const fadeInterval = setInterval(() => {
        if (audioRef.current.volume < 0.45) audioRef.current.volume += 0.05;
        else clearInterval(fadeInterval);
      }, 300);
    }
  }, [currentIndex]);

  const fetchMusicFiles = async () => {
    try {
      const { data } = await axiosInstance.get("/music/music-list");

      if (!data || !Array.isArray(data.files)) throw new Error("Invalid API response format.");

      setMusicFiles(data.files.map((file) => ({
        name: file,
        url: `${BASE_URL}${encodeURIComponent(file)}`,
      })));
    } catch (error) {
      console.error("❌ Error fetching songs:", error);
      setMessage("Failed to fetch music files. Please try again.");
    }
  };

  const checkAdminStatus = async () => {
    try {
      const { data } = await axiosInstance.get("/auth/check-admin");
      setIsAdmin(data.isAdmin);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const togglePlayPause = () => setIsPlaying((prev) => !prev);
  const playNext = () => {
    setCurrentIndex((prev) => (prev + 1) % musicFiles.length);
    setIsPlaying(true);
  };
  const playPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? musicFiles.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const changeVolume = (e) => setVolume(parseFloat(e.target.value));

  const renameMusic = async (oldName) => {
    const newName = renameFields[oldName]?.trim();
    if (!newName) return;

    try {
      await axiosInstance.put("/music/rename-music", { oldName, newName });
      await fetchMusicFiles();
      setEditingFile(null);
    } catch (error) {
      console.error("❌ Rename Error:", error);
      setMessage("Failed to rename music. Try again.");
    }
  };

  const deleteMusic = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) return;

    try {
      await axiosInstance.delete(`/music/delete-music/${encodeURIComponent(filename)}`);
      setMusicFiles((prevFiles) => prevFiles.filter((file) => file.name !== filename));
      setMessage(`✅ "${filename}" deleted successfully.`);
    } catch (error) {
      console.error("❌ Delete Error:", error);
      setMessage("Failed to delete music. Try again.");
    }
  };

  return (
    <div className="music-player-container">
      <h3>🎵 Music Player</h3>
      {musicFiles.length === 0 ? (
        <p>No music available.</p>
      ) : (
        <ul className="playlist">
          {musicFiles.map((file, index) => (
            <li key={index} className={`track ${index === currentIndex ? "playing" : ""}`}>
              <span className="font-weight-bold mr-3">
                {file.name.replace(/\.[^/.]+$/, "")}
              </span>
              <div className="controls">
                <button
                  onClick={() => {
                    if (currentIndex === index) {
                      setIsPlaying(!isPlaying);
                    } else {
                      setCurrentIndex(index);
                      setIsPlaying(true);
                    }
                  }}
                >
                  {currentIndex === index && isPlaying ? "⏸ Pause" : "▶ Play"}
                </button>

                {isAdmin && (
                  <>
                    <button onClick={() => deleteMusic(file.name)}>🗑</button>
                    {editingFile === file.name ? (
                      <input
                        type="text"
                        value={renameFields[file.name] || ""}
                        onChange={(e) =>
                          setRenameFields((prev) => ({ ...prev, [file.name]: e.target.value }))
                        }
                      />
                    ) : (
                      <button onClick={() => setEditingFile(file.name)}>✏️</button>
                    )}
                    {editingFile === file.name && (
                      <button onClick={() => renameMusic(file.name)}>✅</button>
                    )}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <audio
        ref={audioRef}
        src={musicFiles[currentIndex]?.url}
        onEnded={playNext}
        onError={() => {
          console.error("❌ Audio Playback Error:", musicFiles[currentIndex]?.url);
          setPlaybackError(`⚠️ Unable to play "${musicFiles[currentIndex]?.name}".`);
        }}
      />

      <div className="music-controls">
        <button onClick={playPrev}>⏮</button>
        <button onClick={togglePlayPause}>{isPlaying ? "⏸" : "▶️"}</button>
        <button onClick={playNext}>⏭</button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={changeVolume}
          className="volume-slider"
        />
      </div>

      {playbackError && (
        <div className="alert alert-danger mt-3">
          {playbackError}
          <button
            className="btn btn-sm btn-secondary ml-2"
            onClick={() => {
              setPlaybackError("");
              audioRef.current.load();
              audioRef.current.play();
            }}
          >
            🔄 Retry
          </button>
        </div>
      )}

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default MusicPlayer;