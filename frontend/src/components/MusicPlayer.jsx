import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axios.config";
import "../MusicPlayer.css";

const MusicPlayer = () => {
  const [musicFiles, setMusicFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackError, setPlaybackError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [renameFields, setRenameFields] = useState({});
  const [editingFile, setEditingFile] = useState(null);
  const audioRef = useRef(null);
  const BASE_URL = "https://terranovare.tech/";

  useEffect(() => {
    fetchMusicFiles();
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (musicFiles.length > 0) {
      setCurrentIndex(0);
      setIsPlaying(true);
    }
  }, [musicFiles]);

  useEffect(() => {
    if (
      musicFiles.length > 0 &&
      currentIndex < musicFiles.length &&
      audioRef.current
    ) {
      console.log("🎧 Setting audio src to:", musicFiles[currentIndex].url);
      audioRef.current.src = musicFiles[currentIndex].url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          console.warn("⚠️ Autoplay blocked, waiting for user interaction.");
        });
      }
    }
  }, [musicFiles, currentIndex, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const fetchMusicFiles = async () => {
    try {
      const { data } = await axiosInstance.get("/music/music-list", {
        headers: { "Cache-Control": "no-store" },
        params: { timestamp: new Date().getTime() },
      });
      console.log("🎵 API Response:", data);
      if (!data.files || !Array.isArray(data.files))
        throw new Error("Invalid API response format.");
      setMusicFiles(
        data.files.map((file) => ({
          name: file,
          url: `${BASE_URL}uploads/music/${encodeURIComponent(file)}`,
        }))
      );
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

  const renameMusic = async (oldName) => {
    let newName = renameFields[oldName]?.trim();
    if (!newName) return;
  
    // ✅ Ensure filename includes ".mp3" extension
    if (!newName.endsWith(".mp3")) {
      newName += ".mp3";
    }
  
    const payload = { oldName, newName };
  
    console.log("📤 Sending Rename Request:", payload);
  
    try {
      const { data } = await axiosInstance.put("/music/rename-music", payload, {
        headers: { "Content-Type": "application/json" }, // ✅ Ensure JSON format
      });
  
      console.log("🎵 Rename Response:", data);
  
      if (data.success) {
        setEditingFile(null);
        setRenameFields({});
        fetchMusicFiles(); // ✅ Refresh song list after renaming
      } else {
        console.error("❌ Rename Error:", data.error);
        setMessage("Failed to rename file. Please try again.");
      }
    } catch (error) {
      console.error("❌ Rename Request Failed:", error.response?.data || error.message);
      setMessage("Failed to rename file. Please try again.");
    }
  };
  

  const deleteMusic = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`))
      return;

    try {
      await axiosInstance.delete(
        `/music/delete-music/${encodeURIComponent(filename)}`
      );
      setMusicFiles((prevFiles) =>
        prevFiles.filter((file) => file.name !== filename)
      );
      setMessage(`✅ "${filename}" deleted successfully.`);
    } catch (error) {
      console.error("❌ Delete Error:", error);
      setMessage("Failed to delete music. Try again.");
    }
  };

  const togglePlayPause = () => {
    if (musicFiles.length === 0) return;
    setIsPlaying((prev) => !prev);
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
    }
  };

  return (
    <div className="music-player-container">
      <h3>🎵 Music Player</h3>
      {message && <p className="message">{message}</p>}
      {musicFiles.length === 0 ? (
        <p>No music available.</p>
      ) : (
        <ul className="playlist">
          {musicFiles.map((file, index) => (
            <li
              key={index}
              className={`track ${index === currentIndex ? "playing" : ""}`}
            >
              {editingFile === file.name ? (
                <>
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
                  <button onClick={() => renameMusic(file.name)}>✅</button>
                  <button onClick={() => setEditingFile(null)}>❌</button>
                </>
              ) : (
                <span>{file.name.replace(/\.[^/.]+$/, "")}</span>
              )}
              <div className="controls">
                <button
                  onClick={() => {
                    if (currentIndex === index) {
                      togglePlayPause();
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
                    {editingFile === file.name ? (
                      <>
                        <input
                          type="text"
                          value={
                            renameFields[file.name]?.replace(".mp3", "") || ""
                          }
                          onChange={(e) =>
                            setRenameFields((prev) => ({
                              ...prev,
                              [file.name]: e.target.value,
                            }))
                          }
                        />
                        <button onClick={() => renameMusic(file.name)}>
                          ✅
                        </button>
                        {/* ✅ Rename button FIXED */}
                        <button onClick={() => setEditingFile(null)}>❌</button>
                      </>
                    ) : (
                      <button onClick={() => setEditingFile(file.name)}>
                        ✏️
                      </button>
                    )}
                    <button onClick={() => deleteMusic(file.name)}>🗑</button>
                    {/* ✅ Delete button kept separate */}
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
        onEnded={() =>
          setCurrentIndex((prev) => (prev + 1) % musicFiles.length)
        }
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
      {playbackError && <p className="error">{playbackError}</p>}
      <div className="music-controls">
        <button
          onClick={() =>
            setCurrentIndex((prev) =>
              prev === 0 ? musicFiles.length - 1 : prev - 1
            )
          }
        >
          ⏮
        </button>
        <button onClick={togglePlayPause}>{isPlaying ? "⏸" : "▶️"}</button>
        <button
          onClick={() =>
            setCurrentIndex((prev) => (prev + 1) % musicFiles.length)
          }
        >
          ⏭
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="volume-slider"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
