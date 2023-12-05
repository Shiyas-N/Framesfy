/* eslint-disable react/prop-types */
import { useState } from "react";
import FileInput from "./FileInput";
import ImageCropper from "./ImageCropper";

const ImageTool = (props) => {
  const [image, setImage] = useState("");
  const [currentPage, setCurrentPage] = useState("choose-img");
  const [imgAfterCrop, setImgAfterCrop] = useState("");
  const [result, setResult] = useState({});
  // Invoked when new image file is selected
  const onImageSelected = (selectedImg) => {
    setImage(selectedImg);
    setCurrentPage("crop-img");
  };

  // Generating Cropped Image When Done Button Clicked
  const onCropDone = (imgCroppedArea) => {
    const canvasEle = document.createElement("canvas");
    canvasEle.width = imgCroppedArea.width;
    canvasEle.height = imgCroppedArea.height;

    const context = canvasEle.getContext("2d");

    let imageObj1 = new Image();
    imageObj1.src = image;
    imageObj1.onload = function () {
      context.drawImage(
        imageObj1,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      );

      const dataURL = canvasEle.toDataURL("image/jpeg");

      setImgAfterCrop(dataURL);
      setCurrentPage("img-cropped");
    };
  };

  // Handle Cancel Button Click
  const onCropCancel = () => {
    setCurrentPage("choose-img");
    setImage("");
  };

  // Function to send cropped image to the backend
  const sendCroppedImageToBackend = () => {
    fetch(`http://127.0.0.1:5000/campaign/${props.id}/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ croppedImage: imgAfterCrop }), // Send cropped image data
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse response JSON
        } else {
          throw new Error("Failed to send cropped image to the backend");
        }
      })
      .then((data) => {
        // Handle the parsed response data
        setResult(data); // Set the result using the parsed data
        console.log(data); // Log the response data
      })
      .catch((error) => {
        // Handle errors
        console.error("Error sending cropped image:", error);
      });
  };

  //   const { user_id } = useParams();
  //   const [data, setData] = useState(null);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       const result = await axios(
  //         `http://localhost:5000/campaign/${user_id}/download`
  //       );
  //       console.log(result.data);
  //       setData(result.data);
  //     };
  //     fetchData();
  //   }, [user_id]);
  // };

  if (!props.visible) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="relative bg-white p-2 rounded">
        <button
          className="absolute top-2 right-2 border-2"
          onClick={props.onClose}
        >
          <svg
            className="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {/* <h1>Upload Image</h1> */}
        <div className="container">
          {currentPage === "choose-img" ? (
            <FileInput setImage={setImage} onImageSelected={onImageSelected} />
          ) : currentPage === "crop-img" ? (
            <ImageCropper
              image={image}
              onCropDone={onCropDone}
              onCropCancel={onCropCancel}
            />
          ) : (
            <div>
              <div>
                <img src={imgAfterCrop} className="cropped-img" />
              </div>
              <button
                onClick={() => {
                  setCurrentPage("crop-img");
                }}
                className="btn"
              >
                Crop
              </button>
              <button
                onClick={() => {
                  setCurrentPage("choose-img");
                  setImage("");
                }}
                className="btn"
              >
                New Image
              </button>
              <button className="btn" onClick={sendCroppedImageToBackend}>
                Done
              </button>
              <img src={result} alt="Result Image" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageTool;
