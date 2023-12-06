import { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const Camp = () => {
  const [textValue, setTextValue] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 / 1 }); // Adjust aspect ratio as needed

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedImageFile = event.target.files[0];
    setSelectedImage(selectedImageFile);
  };

  const handleImageLoaded = (image) => {
    console.log("Image loaded:", image);
    // You may set initial crop state or handle initial image settings here
  };

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log("Crop complete:", croppedArea, croppedAreaPixels);
    // Handle cropped area, generate cropped image here
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Use croppedImage in FormData for submission
    const formData = new FormData();
    formData.append("textData", textValue);
    formData.append("imageData", croppedImage);

    // Send formData to backend using fetch or your preferred method
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input type="text" value={textValue} onChange={handleTextChange} />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {selectedImage && (
        <ReactCrop
          src={URL.createObjectURL(selectedImage)}
          crop={crop}
          onImageLoaded={handleImageLoaded}
          onComplete={handleCropComplete}
          onChange={handleCropChange}
        />
      )}
      <button type="submit">Submit</button>
    </form>
  );
};

export default Camp;
