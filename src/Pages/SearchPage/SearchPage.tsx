import { useState } from "react";

import Header from "../../Components/Header/Header";
import OfficialSearch from "../../Components/OfficialSearch/OfficialSearch";
import RadioButton from "../../Components/RadioButton/RadioButton";

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

  // TODO: ADD QUERY STATE THAT CHANGES ARE HANDLED IN OfficialSearch

  return (
    <>
      <Header />

      <OfficialSearch
        games={games}
        searchBar1={{ searchType: "referee1", placeHolder: "Referee #1" }}
        searchBar2={{ searchType: "referee2", placeHolder: "Referee #2" }}
      />
      <OfficialSearch
        games={games}
        searchBar1={{ searchType: "linesPerson1", placeHolder: "Linesman #1" }}
        searchBar2={{ searchType: "linesPerson2", placeHolder: "Linesman #2" }}
      />

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
