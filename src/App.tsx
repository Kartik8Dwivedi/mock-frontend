import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Loader from "./components/Loader";
import tick from "../tick.gif"

function App() {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [loader, setLoader] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null
  );

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

  const handleAuthentication = async () => {
    toast("Authenticating...", { icon: "🔒" });
    setLoading(true); // Show shimmer effect
    
    await getUserVideo();
    setTimeout(() => {
      setLoading(false); // Stop shimmer after 1 second
      setLoader(true);
    }, 1000);
    (document.getElementById("my_modal_1") as HTMLDialogElement)?.showModal();

    setTimeout(() => {
      setVerified(true);
    }, 8000);
  };

  const closeCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop()); // Stop all tracks
      setVideoStream(null); // Clear video stream
    }
    (document.getElementById("my_modal_1") as HTMLDialogElement)?.close();

    toast("Authentication Successful", { icon: "🎉" });
  };

  useEffect(() => {
    const modalElement = document.getElementById(
      "my_modal_1"
    ) as HTMLDialogElement;

    if (modalElement) {
      modalElement.addEventListener("close", closeCamera);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("close", closeCamera); 
      }
    };
  }, [videoStream]);

  useEffect(() => {
    if (videoElement && videoStream) {
      videoElement.srcObject = videoStream;
      videoElement.play();
    }
  }, [videoElement, videoStream]);

  useEffect(() => {
    if(verified){
      setVerified(false);
      setTimeout(() => {
        closeCamera();
      }, 1000);
    }
  },[verified])



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
              <div>
                <video
                  className="absolute inset-0 w-full h-full transform scale-x-[-1] object-cover"
                  autoPlay
                  muted
                  ref={(video) => setVideoElement(video)}
                />
              </div>
            )}
            {verified && <div>
              <img src={tick} className="absolute top-24 right-[235px] opacity-80" alt="" />
            </div>}
          </div>
          <div>{loader && <Loader />}</div>
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
