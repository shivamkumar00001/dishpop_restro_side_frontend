import React, { useState, useEffect } from "react";

const TypewriterText = ({ text, className = "", speed = 70 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
       setDisplayedText(text.substring(0, i + 1));

        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
    </span>
  );
};

export default TypewriterText;
