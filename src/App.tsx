import { useRef } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load video stream and BodyPix model
  const getUserVideo = async () => {
    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    // if esc key is pressed, close the video stream and access of the camera will be denied
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        videoStream.getTracks().forEach((track) => track.stop());
        (document?.getElementById("my_modal_1") as HTMLDialogElement)?.close();
      }
    });

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.srcObject = videoStream;
      videoElement.style.transform = "scaleX(-1)"; // Mirror video
      videoElement.play();

      // Ensure video dimensions are set when metadata is loaded
      videoElement.onloadedmetadata = () => {
        if (canvasRef.current) {
          canvasRef.current.width = videoElement.videoWidth;
          canvasRef.current.height = videoElement.videoHeight;
        }
      };
    }

    // Load BodyPix model
    const net = await bodyPix.load();
    blurBackground(net); // Start applying blur effect
  };

  // Function to apply background blur while keeping the user's face clear
  const blurBackground = async (net: bodyPix.BodyPix) => {
    const videoElement = videoRef.current;
    const canvas = canvasRef.current;

    if (videoElement && canvas) {
      const ctx = canvas.getContext("2d");

      const applyBlur = async () => {
        // Clear the canvas for each new frame
        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        // Get segmentation for the video frame
        const segmentation = await net.segmentPerson(videoElement, {
          internalResolution: "medium",
          segmentationThreshold: 0.7,
        });

        // Apply blur effect
        const backgroundBlurAmount = 30; // Adjust to your preference
        const edgeBlurAmount = 5;

        bodyPix.drawBokehEffect(
          canvas,
          videoElement,
          segmentation,
          backgroundBlurAmount,
          edgeBlurAmount,
          true // Mirror the video for user convenience
        );

        // Keep the loop going for real-time updates
        requestAnimationFrame(applyBlur);
      };

      // Start the background blur effect
      applyBlur();
    }
  };

  // Handle authentication button click
  const handleAuthentication = () => {
    getUserVideo();
    return (
      document?.getElementById("my_modal_1") as HTMLDialogElement
    )?.showModal();
  };

  // Close the camera access and stop the video stream
  const closeCamera = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const videoStream = videoElement.srcObject as MediaStream; // Cast srcObject to MediaStream
      videoStream.getTracks().forEach((track) => track.stop()); // Access getTracks method on MediaStream
    }
    (document?.getElementById("my_modal_1") as HTMLDialogElement)?.close();
  }

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <button className="btn btn-secondary" onClick={handleAuthentication}>
        Authenticate
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Facial Authentication</h3>
          <p className="py-4 add-video">
            <video
              ref={videoRef}
              style={{
                transform: "scaleX(-1)",
                display: "block",
                width: "100%",
                height: "auto",
              }} // Make video visible
              autoPlay
              muted
            />
            <canvas
              ref={canvasRef}
              style={{ position: "absolute", top: 0, left: 0 }} // Overlay canvas
            />
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={closeCamera} >Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default App;
