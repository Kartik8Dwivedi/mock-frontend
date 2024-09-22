import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Loader from "./components/Loader";

function App() {
  const [loading, setLoading] = useState(true);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null
  );

  // Function to get the video stream
  const getUserVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.play();
      }
    } catch (error) {
      toast.error("Error accessing the camera. Please check permissions.");
    }
  };

  // Handle opening modal and starting camera
  const handleAuthentication = async () => {
    toast("Authenticating...", { icon: "🔒" });
    setLoading(true); // Show shimmer effect
    await getUserVideo();
    setTimeout(() => {
      setLoading(false); // Stop shimmer after 1 second
    }, 1000);
    (document.getElementById("my_modal_1") as HTMLDialogElement)?.showModal();
  };

  // Close camera when the modal is closed
  const closeCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop()); // Stop all tracks
      setVideoStream(null); // Clear video stream
    }
    (document.getElementById("my_modal_1") as HTMLDialogElement)?.close();
  };

  // Automatically close camera when modal is closed via ESC key or backdrop click
  useEffect(() => {
    const modalElement = document.getElementById(
      "my_modal_1"
    ) as HTMLDialogElement;

    if (modalElement) {
      modalElement.addEventListener("close", closeCamera); // Event listener for modal close
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("close", closeCamera); // Clean up event listener
      }
    };
  }, [videoStream]);

  // Effect to update video element reference once the video element is rendered
  useEffect(() => {
    if (videoElement && videoStream) {
      videoElement.srcObject = videoStream;
      videoElement.play();
    }
  }, [videoElement, videoStream]);

  return (
    <div
      id="bg-image"
      className="flex w-screen h-screen justify-center items-center bg-gray-100"
    >
      <Toaster />
      <button
        className="btn btn-warning btn-sm"
        id="position-btn"
        onClick={handleAuthentication}
      >
        Authenticate
      </button>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box relative bg-white rounded-lg shadow-lg min-w-[50vw]">
          <h3 className="font-bold text-lg text-center mb-4">
            Facial Authentication
          </h3>

          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            {loading ? (
              <div className="flex justify-center items-center absolute top-44 right-80">
                {" "}
                <span className="loading loading-bars loading-lg scale-150"></span>
              </div>
            ) : (
              <video
                className="absolute inset-0 w-full h-full transform scale-x-[-1] object-cover"
                autoPlay
                muted
                ref={(video) => setVideoElement(video)} // Assign the video element
              />
            )}
          </div>
            <div>
              <Loader/>
            </div>
          <div className="modal-action flex justify-center mt-4">
            <button className="btn" onClick={closeCamera}>
              Close
            </button>
          </div>
        </div>
      </dialog>
      <div className="min-h-[150vh]">hello</div>
    </div>
  );
}

export default App;
