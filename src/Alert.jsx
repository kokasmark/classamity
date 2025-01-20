import React, { useState, useEffect } from "react";


const Alert = ({ content,contributors, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration]);

  return (
    <div className={`alert ${isVisible ? "visible" : ""}`}>
      {content}
      <div style={{display: 'flex',flexDirection: 'row',gap: 5, alignItems: "center"}}>
        <p>Thank you, </p>
        {
          contributors.map((contributor,index) =>(
            <p>{contributor}</p>
          ))
        }
        <p>!</p>
      </div>
      <a style={{color: "white"}} href="https://github.com/kokasmark/classamity/issues/1">Wanna help? Click here!</a>
    </div>
  );
};

export default Alert;
