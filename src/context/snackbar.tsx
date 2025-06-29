import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { ProgressBar } from "react-bootstrap";

interface SnackbarContextType { showSnackbar: (message: string, time?: number) => void }

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnackbar must be used within a SnackbarProvider");
  return ctx;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const showSnackbar = useCallback((msg: string, time: number = 5) => {
    setMessage(msg);
    setOpen(true);
    setProgress(100);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    // Animate progress bar
    const interval = 50; // ms
    let elapsed = 0;
    progressRef.current = setInterval(() => {
      elapsed += interval;
      setProgress(Math.max(0, 100 - elapsed / (time * 1000) * 100));
    }, interval);
    timerRef.current = setTimeout(() => {
      setOpen(false);
      setProgress(0);
      if (progressRef.current) clearInterval(progressRef.current);
    }, time * 1000);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setProgress(0);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {open &&
        <div
          className="fixed z-99 rounded text-white bg-gray-800 box-shadow bottom-10"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
          }}
          role="alert"
        >
          <div className="flex align-center py-2 px-4">
            <span>{message}</span>
            <button
              onClick={handleClose}
              style={{
                marginLeft: 16,
                background: "transparent",
                border: "none",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: 18,
              }}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
          <div className="bg-white" style={{
            height: '4px',
            width: `${progress}%`,
          }}/>
        </div>
      }
    </SnackbarContext.Provider>
  );
};
