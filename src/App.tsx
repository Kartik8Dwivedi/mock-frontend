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

      setTimeout(() => {
        setVerified(false);
        setTimeout(() => {
          closeCamera(); 
        }, 2000);
      }, 7000)
    } catch (error) {
      toast.error("Error accessing the camera. Please check permissions.");
    }
  };

  const handleAuthentication = async () => {
    toast("Authenticating...", { icon: "🔒" });
    setLoading(true); 
    
    await getUserVideo();
    setTimeout(() => {
      setLoading(false); 
      setLoader(true);
    }, 1000);
    (document.getElementById("my_modal_1") as HTMLDialogElement)?.showModal();
    setTimeout(() => {
      setVerified(true);

    }, 9000);
  };

  const closeCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop()); 
      setVideoStream(null); 
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
            {verified && (
              <div>
                <img
                  src={tick}
                  className="absolute top-24 right-[245px] opacity-80"
                  alt=""
                />
                <p className="text-xl font-bold text-green-500 absolute right-0 pt-3">
                  User Authenticated
                </p>
              </div>
            )}
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
