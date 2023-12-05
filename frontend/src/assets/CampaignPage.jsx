import { useState, useEffect } from "react";
import ImageTool from "./Components/ImageTool";
import { getUserData, getUserIdFromBackend } from "../../apiServices"; // Adjust the path accordingly
import { useParams } from "react-router-dom";
import axios from "axios";

const Campaign = () => {
  const [showModel, setShowModel] = useState(false);
  function toggleShow() {
    setShowModel((prevState) => !prevState);
  }

  const { user_id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`http://localhost:5000/campaign/${user_id}`);
      console.log(result.data);
      setData(result.data);
    };
    fetchData();
  }, [user_id]);

  // const [userData, setUserData] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const userId = await getUserIdFromBackend();
  //       const userDataResponse = await getUserData(userId);
  //       setUserData(userDataResponse);
  //     } catch (error) {
  //       // Handle errors
  //       console.error('Error:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);
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
        <input
          type="text"
          className="block border-2 w-full mt-10 bg-transparent justify-self-center py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="Name"
        />
        <button
          onClick={toggleShow}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Create
        </button>
        <ImageTool visible={showModel} onClose={toggleShow} id={user_id} />
      </div>
    </div>
  );
};

export default Campaign;
