/* eslint-disable react/prop-types */
import { useState } from "react";
import Cropper from "react-easy-crop";

function ImageCropper({ image, onCropDone, onCropCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const onCropComplete = (_croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center bg-opacity-20 backdrop-blur-sm">
      <div className="">
        <Cropper
          image={image}
          aspect={1 / 1}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            // containerStyle: {
            //   width: "75%",
            //   height: "10rem",
            //   padding: "1rem",
            //   backgroundColor: "#fff",
            // },
            containerStyle: {
              position: "absolute",
              top: "100px",
              width: "calc(100% - 2px)",
              height: window.innerWidth,
              overflow: "hidden",
              border: "1px solid black",
              backgroundColor: "#fff",
            },
            // mediaStyle: { height: "100%", display: "block" },
            cropAreaStyle: {
              position: "absolute",
              border: "1px solid black",
              width: "100%",
              height: "100%",
            },
          }}
        />
        <div
          // className="bg-[red] w-fit h-fit flex p"
          className="mt-48 relative flex justify-center items-center space-x-10"
        >
          <button
            className="px-5 py-2.5 font-medium bg-blue-50 hover:bg-blue-100 hover:text-blue-600 text-blue-500 rounded-lg text-sm"
            onClick={onCropCancel}
          >
            Cancel
          </button>

          <button
            className="px-5 py-2.5 font-medium bg-blue-50 hover:bg-blue-100 hover:text-blue-600 text-blue-500 rounded-lg text-sm"
            onClick={() => {
              onCropDone(croppedArea);
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;
