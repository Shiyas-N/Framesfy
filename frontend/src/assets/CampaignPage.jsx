import { useState, useEffect } from "react";
import ImageTool from "./Components/ImageTool";
import { useParams } from "react-router-dom";
import axios from "axios";

const CampaignPage = () => {
  const [showModel, setShowModel] = useState(false);
  const [data, setData] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [imgAfterCrop, setImgAfterCrop] = useState("");
  // const [croppedImage, setCroppedImage] = useState(null);

  const { user_id } = useParams();

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedImageFile = event.target.files[0];
    setImgAfterCrop(selectedImageFile);
    // Show the cropper component passing selectedImageFile
    // Set cropped image in state after cropping is done
  };

  function toggleShow() {
    setShowModel((prevState) => !prevState);
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Create FormData object
    const formData = new FormData();
    function dataURItoBlob(dataURI) {
      const byteString = atob(dataURI.split(",")[1]);
      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ab], { type: mimeString });
    }

    formData.append("textData", textValue);
    formData.append("imageData", dataURItoBlob(imgAfterCrop));

    // Send formData to backend using fetch or your preferred method
    fetch(`http://127.0.0.1:5000/campaign/${user_id}/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: formData, // Send cropped image data
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
        // setResult(data); // Set the result using the parsed data
        console.log(data); // Log the response data
      })
      .catch((error) => {
        // Handle errors
        console.error("Error sending cropped image:", error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`http://localhost:5000/campaign/${user_id}`);
      console.log(result.data);
      setData(result.data);
    };
    fetchData();
  }, [user_id]);

  if (!data) return <>Loading</>;
  return (
    <div className="w-full h-screen bg-gray-600 flex justify-center items-center px-20 py-10 rounded">
      <div className="bg-white h-full w-96 p-10 flex-column justify-center">
        <img src={data.frame_image} alt="Template" />
        <h1 className="text-3xl">{data.client_title}</h1>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita,
          laudantium.
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
    </div>
  );
};

export default CampaignPage;
