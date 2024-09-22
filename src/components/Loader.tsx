import { useEffect, useState } from "react";


const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [animationFrameId, setAnimationFrameId] = useState(0);
  const names = [
    "Downloading Model",
    "Decryption in Progress",
    "Authenticating User"
  ]

  useEffect(() => { 
    const smoothIncrement = (start: number, end: number, duration: number): void => {
      const startTime: number = performance.now();

      const animate = (currentTime: number): void => {
      const elapsed: number = currentTime - startTime;
      const progressFraction: number = Math.min(elapsed / duration, 1);
      const currentProgress: number = start + (end - start) * progressFraction;

      setProgress(currentProgress);

      if (progressFraction < 1) {
        requestAnimationFrame(animate);
      }
      };

      requestAnimationFrame(animate);
    };

    // Start animations sequentially
    const startAnimation = async () => {
      // First phase: 0% to 33.33% in 1.5 seconds
      await new Promise((resolve) => {
        smoothIncrement(0, 33.33, 1500);
        setTimeout(resolve, 1500);
      });

      // Second phase: 33.33% to 66.67% in 0.8 seconds
      await new Promise((resolve) => {
        smoothIncrement(33.33, 66.67, 800);
        setTimeout(resolve, 800);
      });

      // Third phase: 66.67% to 100% in 1 second
      await new Promise((resolve) => {
        smoothIncrement(66.67, 100, 1000);
        setTimeout(resolve, 1000);
      });
    };

    startAnimation();

    return () => {
      cancelAnimationFrame(animationFrameId); // Clean up on unmount
    };
  }, [animationFrameId]);

  return (
    <div className="mt-5">
      <div className="flex gap-4 items-center">
        <p className="text-xl font-bold text-gray-500">Downloading Model</p>
        <span className="loading loading-dots loading-md bg-gray-500"></span>
      </div>
      <progress
        className="progress progress-primary w-full"
        value={progress}
        max="100"
      ></progress>
    </div>
  );
}

export default Loader