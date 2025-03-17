import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaTiktok, FaDiscord, FaCloud } from "react-icons/fa";
import { SiBluesky } from "react-icons/si"; // BlueSky icon
import "../App.css"

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hovered, setHovered] = useState(null);
    const menuRef = useRef(null);


    // Close menu if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div style={styles.menuContainer} ref={menuRef}>
            {/* Menu Toggle Button */}
            <button
                onClick={(event) => {
                    event.stopPropagation(); // Fix SoundCloud auto-click issue
                    setIsOpen(!isOpen);
                }}
                style={{
                    ...styles.button,
                    background: isOpen ? "#d9534f" : "#222",
                    color: "#fff",
                }}
            >
                {isOpen ? "X" : "☰"}
            </button>

            {/* Expanding Horizontal Menu */}
            <div
                style={{
                    ...styles.menuPanel,
                    transform: isOpen ? "scaleX(1)" : "scaleX(0)",
                    opacity: isOpen ? 1 : 0,
                }}
            >
                <ul style={styles.menuList}>
                          {/* TikTok */}
      <li aria-hidden="false">
        <Link
          to="https://www.tiktok.com/@etherialphoenix"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: hovered === "tiktok" ? "#ff0050" : "#444",
            color: hovered === "tiktok" ? "white" : "white",
            transition: "background 0.3s ease, color 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
          }}
          onClick={() => setIsOpen(false)}
          onMouseEnter={() => setHovered("tiktok")}
          onMouseLeave={() => setHovered(null)}
        >
          <FaTiktok className="social-icon" />
        </Link>
      </li>

      {/* Bluesky */}
      <li aria-hidden="false">
        <Link
          to="https://bsky.app/profile/terranovare.bsky.social"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: hovered === "bluesky" ? "#0085FF" : "#444",
            color: hovered === "bluesky" ? "#444" : "white",
            transition: "background 0.3s ease, color 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
          }}
          onClick={() => setIsOpen(false)}
          onMouseEnter={() => setHovered("bluesky")}
          onMouseLeave={() => setHovered(null)}
        >
          <SiBluesky className="social-icon" />
        </Link>
      </li>

      {/* Instagram */}
      <li aria-hidden="false">
        <Link
          to="https://discord.gg/mUJuAYbS"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: hovered === "discord" ? "#7289DA" : "#444",
            color: hovered === "discord" ? "#444" : "white",
            transition: "background 0.3s ease, color 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
          }}
          onClick={() => setIsOpen(false)}
          onMouseEnter={() => setHovered("discord")}
          onMouseLeave={() => setHovered(null)}
        >
          <FaDiscord className="social-icon" />
        </Link>
      </li>

      {/* SoundCloud */}
      <li aria-hidden="false">
        <Link
          to="https://on.soundcloud.com/UeaT1vwgzEnxoptA8"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: hovered === "soundcloud" ? "#ff8800" : "#444",
            color: hovered === "soundcloud" ? "#444" : "white",
            transition: "background 0.3s ease, color 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
          }}
          onClick={() => setIsOpen(false)}
          onMouseEnter={() => setHovered("soundcloud")}
          onMouseLeave={() => setHovered(null)}
        >
          <FaCloud className="social-icon" />
        </Link>
      </li>
                </ul>
            </div>            
        </div>
    );
};

const styles = {
    menuContainer: {
        position: "fixed",
        bottom: "5px",
        left: "0",
        width: "auto",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
    },
    button: {
        padding: "12px",
        fontSize: "20px",
        cursor: "pointer",
        background: "#222",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        minWidth: "60px",
        minHeight: "60px",
        transition: "background 0.3s ease, transform 0.2s ease",
    },
    menuPanel: {
        display: "flex",
        alignItems: "center",
        background: "#333",
        padding: "8px",
        borderRadius: "8px",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
        transformOrigin: "left",
        transform: "scaleX(0)",
        opacity: 0,
        transition: "transform 0.3s ease-in-out, opacity 0.2s ease-in-out",
        marginLeft: "10px",
    },
    menuList: {
        display: "flex",
        listStyle: "none",
        padding: 0,
        margin: 0,
        gap: "20px",
    },
    menuItem: {
        width: "45px",
        height: "45px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#444",
        borderRadius: "50%",
        cursor: "pointer",
        textDecoration: "none",
        transition: "background 0.3s ease-in-out, transform 0.2s ease-in-out",
    },
    menuLabel: {
        marginLeft: "10px",
        fontSize: "18px",
        fontWeight: "bold",
        color: "#fff",
    },
};

export default Menu;
