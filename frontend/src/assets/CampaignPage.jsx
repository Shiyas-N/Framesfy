import { useState, useEffect } from "react";
import ImageTool from "./Components/ImageTool";
const Campaign = () => {
  const [showModel, setShowModel] = useState(false);
  const [data, setData] = useState([{}]);
  function toggleShow() {
    setShowModel((prevState) => !prevState);
  }
  useEffect(() => {
    fetch("'/campaign/<string:user_id>'")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  return (
    <div className="w-full h-screen bg-gray-600 flex justify-center items-center px-20 py-10 rounded">
      <div className="bg-white h-full w-96 p-10 flex-column justify-center">
        <img src="./demo_temp.jpg" alt="Template" />
        <h1 className="text-3xl">Lorem ipsum, dolor sit amet</h1>
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
        <ImageTool visible={showModel} onClose={toggleShow} />
      </div>
    </div>
  );
};

export default Campaign;
