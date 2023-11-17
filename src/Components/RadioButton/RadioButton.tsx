import React from "react";
import "./RadioButton.css";

const RadioButton = ({ name, value, checked, onChange }: any) => {
    
  return (
    <label className="radio-container">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {value}
    </label>
  );
};

export default RadioButton;
