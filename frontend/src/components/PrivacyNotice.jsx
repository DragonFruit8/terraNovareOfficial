import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";

const PrivacyNotice = () => {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("privacyConsent");
    if (!hasAccepted) {
      setShowNotice(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("privacyConsent", "accepted");
    setShowNotice(false);
  };

  const handleDecline = () => {
    localStorage.setItem("privacyConsent", "declined");
    setShowNotice(false);
  };

  if (!showNotice) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        bgcolor: "rgba(0, 0, 0, 0.8)",
        color: "#fff",
        textAlign: "center",
        padding: "16px",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap"
      }}
    >
      <Typography variant="body2" sx={{ marginRight: "16px" }}>
        We use cookies and analytics to understand how you interact with our site and improve your experience. Your data is handled with care. 
      </Typography>
      <Button
        variant="contained"
        size="small"
        onClick={handleAccept}
        sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#45A049" }, marginRight: "8px" }}
      >
        Accept
      </Button>
      <Button
        variant="outlined"
        size="small"
        onClick={handleDecline}
        sx={{ color: "#fff", borderColor: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
      >
        Decline
      </Button>
    </Box>
  );
};

export default PrivacyNotice;
