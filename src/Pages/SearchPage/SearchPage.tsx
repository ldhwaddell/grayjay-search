import { useState } from "react";

import Header from "../../Components/Header/Header";
import RadioButton from "../../Components/RadioButton/RadioButton";

import "./SearchPage.css";

const SearchPage = () => {
  const [selectedDisplayOption, setSelectedDisplayOption] = useState("Display");

  const handleOptionChange = (option: string) => {
    setSelectedDisplayOption(option);
  };

  return (
    <>
      <Header />
      <div className="radio-button-container">
        <RadioButton
          text="Display"
          tooltipText="Only display games that match your search"
          checked={selectedDisplayOption === "Display"}
          onChange={() => handleOptionChange("Display")}
        />
        <RadioButton
          text="Highlight"
          tooltipText="Highlight games that match your search"
          checked={selectedDisplayOption === "Highlight"}
          onChange={() => handleOptionChange("Highlight")}
        />
      </div>
    </>
  );
};

export default SearchPage;
