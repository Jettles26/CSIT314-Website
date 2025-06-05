import React, { useEffect, useState } from "react";
import "./Alert.css";

const Alert = ({ message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
    }, [message, duration, onClose]);

  if (!visible) return null;

  return (
    <div className="alert">
      <span className="closebtn" onClick={() => {
        setVisible(false);
        if (onClose) onClose();
      }}>
        &times;
      </span>
      {message}
    </div>
  );
};

export default Alert;