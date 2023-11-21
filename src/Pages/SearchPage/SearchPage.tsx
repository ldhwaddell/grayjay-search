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
  const [query, setQuery] = useState({
    referee: {
      referee1: null,
      referee2: null,
      condition: null,
    },
    linesman: {
      linesman1: null,
      linesman2: null,
      condition: null,
    },
  });

  const handleOptionChange = (option: string) => {
    setSelectedDisplayOption(option);
  };

  // TODO: 1. Refactor animation styles (use react to change styles, not add/remove component?)
  //  2. Fix sizing of popup
  // 3. Build and create handlers for query object. 
  // 4. message passing to content script
  // 5. Build ability for content script to hide/show game divs.
  return (
    <>
      <Header />

      <OfficialSearch
        games={games}
        searchBar1={{ searchType: "referee1", placeHolder: "Referee #1" }}
        searchBar2={{ searchType: "referee2", placeHolder: "Referee #2" }}
      />
      {/* <OfficialSearch
        games={games}
        searchBar1={{ searchType: "linesPerson1", placeHolder: "Linesman #1" }}
        searchBar2={{ searchType: "linesPerson2", placeHolder: "Linesman #2" }}
      /> */}

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
