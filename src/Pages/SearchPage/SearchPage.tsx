import { useState } from "react";

import Header from "../../Components/Header/Header";
import RadioButton from "../../Components/RadioButton/RadioButton";
import SearchBar from "../../Components/SearchBar/SearchBar";

import "./SearchPage.css";

interface GameData {
  url: string;
  id: number;
  referee1: string;
  referee2: string;
  linesPerson1: string;
  linesPerson2: string;
  timeKeeper1: string;
  timeKeeper2: string;
}

interface Props {
  games: GameData[];
}

const SearchPage = ({ games }: Props) => {
  const [selectedDisplayOption, setSelectedDisplayOption] = useState("Display");

  const handleOptionChange = (option: string) => {
    setSelectedDisplayOption(option);
  };

  return (
    <>
      <Header />

      <div className="referee-search-container">
        <SearchBar
          games={games}
          searchType="referee1"
          placeHolder="Referee 1"
        />
      </div>

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
