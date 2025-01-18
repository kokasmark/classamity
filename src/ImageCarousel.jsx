import React, { useState, useEffect} from "react";

const ImageCarousel = ({images, imgClassName="pixel-perfect-4x", overrideStyle, noItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current image index

  useEffect(() => {
    setCurrentIndex(0)
    const interval = setInterval(() => {
      // Cycle through images
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [images]);

  return (
    <div className="first-child">
    <div className="img-container" style={overrideStyle}>
      {images.length > 0 ? (<div>{images.map((item, index) => (
        <div
          className={`img-item ${index === currentIndex ? "visible" : "hidden"}`}
          key={item.name}
        >
          <a href={item.link} target="_blank">
            <img
              className={imgClassName}
              src={item.icon}
              title={item.name}
              alt={item.name}
            />
          </a>
        </div>
      ))}</div>): (
      <div>
         <div
          className={`img-item visible`}
          key={noItem}
        >
          <a>
            <img
              className={imgClassName}
              src={`/classamity/${noItem}`}
            />
          </a>
        </div>
      </div>)}
    </div>
    </div>
  );
};

export default ImageCarousel;
