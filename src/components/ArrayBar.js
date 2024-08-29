import React from "react";
import "./ArrayBar.css";

const ArrayBar = ({ value }) => {
  return (
    <div className="array-bar-container">
      <div
        className="array-bar"
        style={{ height: `${value}px` }} // Set height dynamically
      />
      <div className="array-bar-label">{value}</div>
    </div>
  );
};

export default ArrayBar;
