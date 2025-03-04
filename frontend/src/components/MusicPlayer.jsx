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
  const [renameFields, setRenameFields] = useState({});
  const [editingFile, setEditingFile] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchMusicFiles();
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume; // ✅ Ensure volume is set correctly
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.1;
      const fadeInterval = setInterval(() => {
        if (audio.volume < 0.45) {
          audio.volume += 0.05;
        } else {
          clearInterval(fadeInterval);
        }
      }, 300);
    }
  }, [currentIndex]);

  const fetchMusicFiles = async () => {
    try {
      const response = await axiosInstance.get("/music/music-list");
      const formattedFiles = response.data.files.map((file) => ({
        name: file,
        url: `http://localhost:9000/uploads/music/${file}`,
      }));
      setMusicFiles(formattedFiles);
    } catch (error) {
      console.error("❌ Error fetching music:", error);
    }
  };

  const checkAdminStatus = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      const response = await axiosInstance.get("/auth/check-admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const playNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % musicFiles.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? musicFiles.length - 1 : prevIndex - 1
    );
    setIsPlaying(true);
  };

  const changeVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume; // ✅ Ensure volume updates instantly
    }
  };

  const renameMusic = async (oldName) => {
    let newName = renameFields[oldName]?.trim();
    if (!newName) return;
    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.put(
        "/music/rename-music",
        { oldName, newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchMusicFiles();
      setEditingFile(null);
    } catch (error) {
      console.error("❌ Rename Error:", error);
    }
  };

  const deleteMusic = async (filename) => {
    if (!window.confirm(`Delete ${filename}?`)) return;
    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.delete(`/music/delete-music/${filename}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMusicFiles(musicFiles.filter((file) => file.name !== filename));
    } catch (error) {
      console.error("❌ Delete Error:", error);
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
            <li
              key={index}
              className={`track ${index === currentIndex ? "playing" : ""}`}
            >
              <span className="font-weight-bold mr-3">
                {file.name.replace(/\.[^/.]+$/, "")}
              </span>
              <div className="controls">
                <button
                  onClick={() => {
                    if (currentIndex === index) {
                      // Toggle Play/Pause
                      if (isPlaying) {
                        audioRef.current.pause();
                      } else {
                        audioRef.current.play();
                      }
                      setIsPlaying(!isPlaying);
                    } else {
                      // Change Track & Play
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
                          setRenameFields((prev) => ({
                            ...prev,
                            [file.name]: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <button onClick={() => setEditingFile(file.name)}>
                        ✏️
                      </button>
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
          console.error(
            "❌ Audio Playback Error:",
            musicFiles[currentIndex]?.url
          );
          setPlaybackError(
            `⚠️ Unable to play "${musicFiles[currentIndex]?.name}".`
          );
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
      {/* 🔥 Error Message */}
      {playbackError && (
        <div className="alert alert-danger mt-3">
          {playbackError}
          <button
            className="btn btn-sm btn-secondary ml-2"
            onClick={() => {
              setPlaybackError("");
              audioRef.current.load(); // Reloads the audio file
              audioRef.current.play(); // Try to play again
            }}
          >
            🔄 Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
