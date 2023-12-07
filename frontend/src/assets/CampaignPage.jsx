import { useState, useEffect } from "react";
import ImageTool from "./Components/ImageTool";
import { useParams } from "react-router-dom";
import axios from "axios";

const CampaignPage = () => {
  const [showModel, setShowModel] = useState(false);
  const [data, setData] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [imgAfterCrop, setImgAfterCrop] = useState("");
  const [resultImage, setResultImage] = useState("");

  // const [croppedImage, setCroppedImage] = useState(null);

  const { user_id } = useParams();

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedImageFile = event.target.files[0];

    if (selectedImageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImageFile);

      reader.onloadend = () => {
        if (
          typeof reader.result === "string" &&
          reader.result.startsWith("data:image")
        ) {
          setImgAfterCrop(reader.result); // Set the Base64-encoded image
          // console.log(imgAfterCrop);
        } else {
          console.error("Invalid image format or could not read the file.");
          // Handle the error accordingly if the image data URL is invalid
        }
      };
    }
  };

  function toggleShow() {
    setShowModel((prevState) => !prevState);
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Create FormData object
    const formData = new FormData();
    // Function to convert dataURI to Blob
    const dataURItoBlob = (dataURI) => {
      // if (!dataURI) {
      //   return null;
      // }

      // Split the data URI to get the data part
      const byteString = atob(dataURI.split(",")[1]);
      // Get the MIME type of the data
      const mimeType = dataURI.split(",")[0].split(":")[1].split(";")[0];

      // Create an ArrayBuffer and Uint8Array for the byte string
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      // Set the byte values into the ArrayBuffer
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // Create a Blob from ArrayBuffer
      return new Blob([ab], { type: mimeType });
    };

    formData.append("textData", textValue);
    const blobObject = dataURItoBlob(imgAfterCrop);
    console.log(blobObject);
    formData.append("croppedImage", blobObject);

    // Send formData to backend using fetch or your preferred method
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/campaign/${user_id}/download`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send cropped image to the backend");
      }

      const data = await response.json();
      console.log(data);
      const resultant = dataURItoBlob(data);
      const blobURL = URL.createObjectURL(resultant);
      setResultImage(blobURL);
    } catch (error) {
      console.error("Error sending cropped image:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`http://localhost:5000/campaign/${user_id}`);
      setData(result.data);
    };
    fetchData();
  }, [user_id]);

  const downloadImage = (imageUrl) => {
    // Create a temporary anchor element
    const downloadLink = document.createElement("a");
    downloadLink.href = imageUrl;

    // Set the download attribute and filename
    downloadLink.download = "downloaded_image.png"; // Change the file name and extension as needed

    // Append the anchor element to the body
    document.body.appendChild(downloadLink);

    // Trigger the click event to start the download
    downloadLink.click();

    // Clean up: remove the anchor element
    document.body.removeChild(downloadLink);
  };

  if (!data) return <>Loading</>;
  return (
    <div className="">
      <div className="w-full h-screen bg-gray-600 flex justify-center items-center px-20 py-10 rounded">
        {!resultImage ? (
          <div className="bg-white h-full w-96 p-10 flex-column justify-center">
            <img src={data.frame_image} alt="Template" />
            <h1 className="text-3xl">{data.client_title}</h1>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Expedita, laudantium.
            </p>
            {/* <input
          type="text"
          className="rounded block border-2 w-full mt-10 bg-transparent justify-self-center py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-center placeholder-center"
          placeholder="Name"
        />
        <button
          onClick={toggleShow}
          className="mt-5 relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
        >
          Upload Image
        </button>
        <ImageTool visible={showModel} onClose={toggleShow} id={user_id} /> */}

            <form action="" onSubmit={handleFormSubmit}>
              <input
                type="text"
                value={textValue}
                onChange={handleTextChange}
                placeholder="Name"
                className="rounded block border-2 w-full mt-10 bg-transparent justify-self-center py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-center placeholder-center"
              />
              <input
                onClick={toggleShow}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-5 relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
              />
              <ImageTool
                visible={showModel}
                onClose={toggleShow}
                id={user_id}
                imgAfterCrop={imgAfterCrop}
                setImgAfterCrop={setImgAfterCrop}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        ) : (
          <div className="bg-white h-full w-96 p-10 flex-column justify-center">
            <img src={resultImage} alt="" />
            <button onClick={() => downloadImage(resultImage)}>Download</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignPage;
