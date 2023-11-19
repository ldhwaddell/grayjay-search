import { useState } from "react";

import Header from "../../Components/Header/Header";
import RadioButton from "../../Components/RadioButton/RadioButton";
import SearchBar from "../../Components/SearchBar/SearchBar";
import EditSearchButton from "../../Components/EditSearchBarButton/EditSearchBarButton";

import AndOrToggle from "../../Components/AndOrToggle/AndOrToggle";

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
  const [isAndSelected, setIsAndSelected] = useState(true);

  const [showSecondRefereeSearchBar, setShowSecondRefereeSearchBar] =
    useState(false);

  const handleOptionChange = (option: string) => {
    setSelectedDisplayOption(option);
  };

  const handleToggleChange = (isAnd: boolean) => {
    console.log(`Toggle is now in the ${isAnd ? "AND" : "OR"} position.`);
    setIsAndSelected(isAnd);
  };

  const toggleSecondRefereeSearchBar = () => {
    setShowSecondRefereeSearchBar((prev) => !prev);
  };

  return (
    <>
      <Header />

      <div className="official-search-container">
        <div className="search-bar-with-button">
          <SearchBar
            games={games}
            searchType="referee1"
            placeHolder="Referee 1"
          />
          <EditSearchButton
            add={!showSecondRefereeSearchBar}
            onClick={toggleSecondRefereeSearchBar}
          />
        </div>
        <AndOrToggle isAnd={isAndSelected} onToggle={handleToggleChange} />
        {showSecondRefereeSearchBar && (
          <SearchBar
            games={games}
            searchType="referee2"
            placeHolder="Referee 2"
          />
        )}
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
