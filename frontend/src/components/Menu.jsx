import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaTiktok, FaInstagram, FaCloud } from "react-icons/fa";
import { SiBluesky } from "react-icons/si"; // BlueSky icon
import "../App.css"

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
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
                    <li>
                        <Link
                            to="https://www.tiktok.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.menuItem}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#ff0050")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
                        >
                            <FaTiktok className="social-icon tikTok" />
                        </Link>

                    </li>
                    <li>
                        <Link
                            to="https://bsky.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.menuItem}
                            // onMouseEnter={(e) => (e.currentTarget.style.background = "#0096ff")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
                        >
                            <SiBluesky className="social-icon blueSky" />
                        </Link>

                    </li>
                    <li>
                        <Link
                            to="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.menuItem}
                            // onMouseEnter={(e) => (e.currentTarget.style.color = "#C13584")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#444")}
                        >
                            <FaInstagram className="social-icon instaGram" />
                        </Link>

                    </li>
                    <li>
                        <Link
                            to="https://soundcloud.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.menuItem}
                            // onMouseEnter={(e) => (e.currentTarget.style.color = "#ff8800")}
                            // onMouseLeave={(e) => (e.currentTarget.style.background = "#444")}
                        >
                            <FaCloud className="social-icon soundCloud" />
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
        bottom: "25px",
        left: "20px",
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
