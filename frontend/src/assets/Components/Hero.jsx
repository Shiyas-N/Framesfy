const Hero = () => {
  return (
    <div className="flex justify-center items-center px-20 h-screen">
      <div className=" flex-column p-5 gap-4 justify-center">
        <div className="">
          <h1 className="font-bold text-5xl">Lorem ipsum dolor sit amet</h1>
          <h4>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus
            error, harum soluta voluptate
          </h4>
        </div>
        <div className="mt-20 flex gap-10 justify-center">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border-2 border-blue-500 border-none">
            Explore Campaigns
          </button>
          <button className="border-2 border-blue-500 text-blue-500 font-semibold py-2 px-4 rounded hover:bg-blue-100 ">
            Create Campaigns
          </button>
        </div>
      </div>
      <img src="Group 77.png" alt="photo grid" className="" />
    </div>
  );
};

export default Hero;
