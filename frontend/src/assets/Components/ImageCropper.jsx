/* eslint-disable react/prop-types */
import { useState } from "react";
import Cropper from "react-easy-crop";

function ImageCropper({ image, onCropDone, onCropCancel, aspect_ratio }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const onCropComplete = (_croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  return (
    <div className="w-5 h-5 bg-[blue]">
      <div>
        <Cropper
          image={image}
          aspect={aspect_ratio}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: {
              width: "50%",
              height: "50%",
              backgroundColor: "#fff",
            },
          }}
        />
        <div className="bg-[red] w-fit h-fit flex p">
          <button className="" onClick={onCropCancel}>
            Cancel
          </button>

          <button
            className=""
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
