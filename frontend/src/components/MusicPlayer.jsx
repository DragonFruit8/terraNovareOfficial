import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios.config";

const MusicPlayer = () => {
  const [musicFiles, setMusicFiles] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchMusicFiles();
    checkAdminStatus();
  }, []);

  const fetchMusicFiles = async () => {
    try {
      const response = await axiosInstance.get("/music-list");
      setMusicFiles(response.data.files);
    } catch (error) {
      console.error("Error fetching music:", error);
    }
  };

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await axiosInstance.get("/auth/check-admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const deleteMusic = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) return;
    try {
      await axiosInstance.delete(`/delete-music/${filename}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchMusicFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const renameMusic = async (oldName) => {
    if (!newFileName.trim()) {
      alert("Enter a new name first.");
      return;
    }
    try {
      await axiosInstance.put(
        "/rename-music",
        { oldName, newName: newFileName },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setNewFileName("");
      fetchMusicFiles();
    } catch (error) {
      console.error("Error renaming file:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Music Preview</h3>
      {musicFiles.length === 0 ? (
        <p>No music available.</p>
      ) : (
        <ul className="list-group">
          {musicFiles.map((file, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {file}
              <div>
                <button className="btn btn-sm btn-primary mr-2" onClick={() => setCurrentTrack(file)}>
                  Play
                </button>
                {isAdmin && (
                  <>
                    <button className="btn btn-sm btn-danger mr-2" onClick={() => deleteMusic(file)}>
                      Delete
                    </button>
                    <input
                      type="text"
                      placeholder="New name"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      className="mr-2"
                    />
                    <button className="btn btn-sm btn-warning" onClick={() => renameMusic(file)}>
                      Rename
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {currentTrack && (
        <audio controls className="mt-3" autoPlay>
          <source src={`/uploads/music/${currentTrack}`} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      )}
    </div>
  );
};

export default MusicPlayer;
