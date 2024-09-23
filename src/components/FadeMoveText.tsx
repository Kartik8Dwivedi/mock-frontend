import React, { useEffect, useState } from "react";
import { MovingComponent } from "react-moving-text";

interface FadeMoveTextProps {
  texts: string[];
}

const FadeMoveText: React.FC<FadeMoveTextProps> = ({ texts }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    if (currentTextIndex < texts.length) {
      const durations = [1500, 800, 1000]; // Durations for each text
      const currentDuration = durations[currentTextIndex];

      const timeout = setTimeout(() => {
        setCurrentTextIndex((prevIndex) => prevIndex + 1);
      }, currentDuration + 1000); 

      return () => clearTimeout(timeout);
    }
  }, [currentTextIndex, texts]);

  return (
    <div className="text-container">
      {currentTextIndex < texts.length && (
        <MovingComponent
          type="fadeInFromTop"
          duration="500ms" 
          delay="0s"
          direction="normal"
          timing="ease-in-out"
          iteration="1"
          fillMode="none"
        >
          {texts[currentTextIndex]}
        </MovingComponent>
      )}
    </div>
  );
};

export default FadeMoveText;
