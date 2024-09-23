import { useEffect, useState } from "react";
import { MovingComponent } from "react-moving-text";

const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const names = [
    "Downloading Model",
    "Decryption in Progress",
    "Authenticating User",
  ];

  useEffect(() => {
    const smoothIncrement = (
      start: number,
      end: number,
      duration: number
    ): void => {
      const startTime: number = performance.now();

      const animate = (currentTime: number): void => {
        const elapsed: number = currentTime - startTime;
        const progressFraction: number = Math.min(elapsed / duration, 1);
        const currentProgress: number =
          start + (end - start) * progressFraction;

        setProgress(currentProgress);

        if (progressFraction < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    const startAnimation = async () => {
      await new Promise((resolve) => {
        smoothIncrement(0, 33.33, 1500);
        setCurrentTextIndex(0);
        setTimeout(resolve, 1500);
      });

      await new Promise((resolve) => {
        smoothIncrement(33.33, 66.67, 1400);
        setCurrentTextIndex(1);
        setTimeout(resolve, 1400);
      });

      await new Promise((resolve) => {
        smoothIncrement(66.67, 100, 1000);
        setCurrentTextIndex(2);
        setTimeout(resolve, 1000);
      });
    };

    startAnimation();
  }, []);

  return (
    <div className="mt-5">
      <div className="flex gap-4 items-center">
        <p className="text-xl font-bold text-gray-500">
          <MovingComponent
            type="fadeInFromTop"
            duration="500ms"
            delay="0s"
            direction="normal"
            timing="ease-in-out"
            iteration="1"
            fillMode="none"
          >
            {names[currentTextIndex]}
          </MovingComponent>
        </p>
        <span className="loading loading-dots loading-md bg-gray-500"></span>
      </div>
      <progress
        className="progress progress-primary w-full"
        value={progress}
        max="100"
      ></progress>
    </div>
  );
};

export default Loader;
