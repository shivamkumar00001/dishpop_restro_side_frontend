import React, { useEffect, useState } from "react";

const DynamicGradientText = () => {
  const words = [
    "AR Intelligence",
    "Smart Vision",
    "3D Mapping",
    "Real-World AI",
    "Interactive AR",
  ];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setFade(true);
      }, 400);
    }, 740);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`
        inline-block
        text-transparent 
        bg-clip-text 
        bg-gradient-to-r 
        from-cyan-400 to-blue-500
        bg-[length:100%_100%]       
        font-semibold 
        transition-opacity duration-500 ease-in-out
        ${fade ? "opacity-100" : "opacity-0"}
      `}
      style={{
      backgroundImage: "linear-gradient(to right, #22d3ee, #3b82f6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    }}

    >
      {words[index]}
    </span>
  );
};

export default DynamicGradientText;
