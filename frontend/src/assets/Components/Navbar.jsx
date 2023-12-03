import { useState, useEffect } from "react";

const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full mt-2 flex justify-between items-center p-9 px-20 border-b-2 border-gray-100 fixed transition-colors duration-200 ease-in-out 
      ${scrollPosition > 100 ? "bg-white" : "bg-transparent"}`}
    >
      <img src="" alt="Logo"></img>
      <div className="flex items-center space-x-4">
        <a href="">Home</a>
        <a href="">About</a>
        <a href="">Pricing</a>
      </div>
    </div>
  );
};

export default Navbar;
