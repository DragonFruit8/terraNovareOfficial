import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={styles.menuContainer}>
            <button onClick={() => setIsOpen(!isOpen)} style={styles.button}>
                {isOpen ? "X" : "Menu"}
            </button>
            {isOpen && (
                <div style={{
                    ...styles.menu,
                    width: isOpen ? "fit-content" : "0",
                    overflow: isOpen ? "10px" : "0"
                }}>
                    <ul style={styles.menu}>
                        <Link style={styles.menuItem} to="/">Home</Link>
                        <Link style={styles.menuItem}>About</Link>
                        <Link style={styles.menuItem}>Services</Link>
                        <Link style={styles.menuItem}>Contact</Link>
                    </ul>
                </div>
            )}
        </div>
    )
}

const styles = {
    menuContainer: {
        position: "fixed",
        bottom: "25px",
        left: "70px",
        display: "flex",
        alignItems: "center",
        padding: "5px",
        overflow: "hidden",
        background: "#fff5",
        zIndex: 1000,
    },
    button: {
        padding: "10px",
        fontSize: "16px",
        cursor: "pointer",
        background: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        marginRight: "10px",
        minWidth: "75px",
    },
    menu: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        margin: "auto",
        gap: "20px",
        overflow: "hidden",
        transition: "width 0.3s ease-in-out, padding 0.3s ease-in-out",
        whiteSpace: "nowrap",
    },
    menuItem: {
        padding: "10px 15px",
        color: "white",
        background: "#000",
        borderRadius: "3px",
        cursor: "pointer",
        transition: "width 0.3s ease-in-out",
        textDecoration: "none",
    },
}

export default Menu;