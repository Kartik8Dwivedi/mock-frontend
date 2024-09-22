
function App() {

const getUserVideo = () => {
    const video = navigator.mediaDevices.getUserMedia({ video: true });

    video.then((stream) => {
      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.play();
      // appending this element to the element with class name as add-video
      document.querySelector(".add-video")?.appendChild(videoElement);
      // document.body.appendChild(videoElement);
    });
}

const handleAuthentication = () =>{
  getUserVideo();
  return (document?.getElementById("my_modal_1") as HTMLDialogElement)?.showModal();
}
  
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <button
        className="btn btn-secondary"
        onClick={handleAuthentication}
      >
        Authenticate
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Facial Authentication</h3>
          <p className="py-4 add-video">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default App
