import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CombinedComponent = () => {
  const [showModel, setShowModel] = useState(false);
  const [data, setData] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [imgAfterCrop, setImgAfterCrop] = useState("");
  const inputRef = useRef();

  const { user_id } = useParams();

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function () {
        setImgAfterCrop(reader.result);
        setShowModel(true);
      };
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("textData", textValue);
    formData.append("imageData", imgAfterCrop);

    fetch(`http://127.0.0.1:5000/campaign/${user_id}/download`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to send data to the backend");
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  const fetchData = async () => {
    try {
      const result = await axios(`http://localhost:5000/campaign/${user_id}`);
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user_id]);

  const onChooseImg = () => {
    inputRef.current.click();
  };

  return (
    <div className="w-full h-screen bg-gray-600 flex justify-center items-center px-20 py-10 rounded">
      <div className="bg-white h-full w-96 p-10 flex-column justify-center">
        {/* Display your fetched data */}
        {data && (
          <>
            <img src={data.frame_image} alt="Template" />
            <h1 className="text-3xl">{data.client_title}</h1>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Expedita, laudantium.
            </p>
          </>
        )}
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={textValue}
            onChange={handleTextChange}
            placeholder="Name"
            className="rounded block border-2 w-full mt-10 bg-transparent justify-self-center py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-center placeholder-center"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={inputRef}
            style={{ display: "none" }}
          />
          <button
            onClick={onChooseImg}
            className="mt-5 relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
          >
            Upload Image
          </button>
          {showModel && (
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
              <div className="relative bg-white p-2 rounded">
                {/* Include your image cropping functionality here */}
                {/* Use imgAfterCrop and setImgAfterCrop */}
                {/* ... */}
                <img src="" alt="Image" />

                <button
                  className="absolute top-2 right-2 border-2"
                  onClick={() => setShowModel(false)}
                >
                  X{/* Close button icon */}
                </button>
              </div>
            </div>
          )}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CombinedComponent;
