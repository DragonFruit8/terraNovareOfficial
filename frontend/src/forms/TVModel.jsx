import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogActions, DialogContent, Button } from "@mui/material";
import DonorSponsorForm from "./DonorSponsorForm";
import WebDevForm from "./WebDevForm";
import DJServiceForm from "./DJServiceForm";

export default function TVModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState("A");
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSuccess = () => {
    setShowThankYou(true); // ✅ Show Thank You message
    setTimeout(() => {
      setIsOpen(false); // ✅ Close modal after 3 seconds
      setShowThankYou(false); // Reset for next time
    }, 3000);
  };

  return (
    <div>
      {/* Open Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="contained"
        className="btn"
        id="joinBtn"
      >
        Get Involved
      </Button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <Dialog
          open={isOpen}
            onClose={() => setIsOpen(false)}
            fullWidth
            maxWidth="sm"
          >
          {/* Close Button */}
          <DialogActions>
               <button onClick={() => setIsOpen(false)} color="error" className="btn btn-danger">
                 Close
               </button>
             </DialogActions>
            <DialogContent className="modal-content">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="modal-body"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                  className="py-2"
                >
                  {showThankYou ? (
                    // ✅ "Thank You" Screen
                    <div className="text-center">
                      <h2 aria-hidden="false" className="modal-title">🎉 Thank You! 🎉</h2>
                      <p aria-hidden="false" className="lead">
                        Your support means the world to us!
                      </p>
                    </div>
                  ) : (
                    // ✅ Form Selection Screen
                    <>
                      <h2 aria-hidden="false" className="modal-title">Choose Form</h2>

                      {/* Tab Buttons */}
                      <div className="row gap-2 d-flex justify-content-center mt-2">
                        <Button
                          className={`btn fw-bold ${
                            activeForm === "A"
                              ? "btn-dark bg-dark border border-light text-warning"
                              : "btn-outline-dark"
                          }`}
                          onClick={() => setActiveForm("A")}
                        >
                          Contribute
                        </Button>

                        <Button
                          className={`btn fw-bold ${
                            activeForm === "B"
                              ? "btn-dark bg-dark border border-light text-warning"
                              : "btn-outline-dark"
                          }`}
                          onClick={() => setActiveForm("B")}
                        >
                          Web Dev
                        </Button>
                        <Button
                          className={`btn fw-bold ${
                            activeForm === "C"
                              ? "btn-dark bg-dark border border-light text-warning"
                              : "btn-outline-dark"
                          }`}
                          onClick={() => setActiveForm("C")}
                        >
                          DJ Request
                        </Button>
                      </div>

                      {/* Show the Selected Form */}
                      <div className="mt-4">
                        {activeForm === "A" && (
                          <DonorSponsorForm setIsOpen={setIsOpen} onSuccess={handleSuccess} />
                        )}
                        {activeForm === "B" && (
                          <WebDevForm setIsOpen={setIsOpen} onSuccess={handleSuccess} />
                        )}
                        {activeForm === "C" && (
                          <DJServiceForm setIsOpen={setIsOpen} onSuccess={handleSuccess} />
                        )}
                        
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </DialogContent>

           
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
