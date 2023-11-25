import React, { useState } from "react";

import SearchBar from "../../Components/SearchBar/SearchBar";
import AddButton from "../AddButton/AddButton";

import Toggle from "../Toggle/Toggle";

import "./OfficialSearch.css";

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

type RefereeType =
  | "referee1"
  | "referee2"
  | "linesPerson1"
  | "linesPerson2"
  | "timeKeeper1"
  | "timeKeeper2";

interface Props {
  games: GameData[];
  primarySearchBar: {
    type: RefereeType;
    placeHolder: string;
  };
  secondarySearchBar: {
    type: RefereeType;
    placeHolder: string;
  };
}

const OfficialSearch = ({ games, primarySearchBar, secondarySearchBar }: Props) => {
  const [isAnd, setIsAnd] = useState(true);
  const [showSecondSearchBar, setShowSecondSearchBar] = useState(false);

  const handleToggleChange = (isAnd: boolean) => {
    console.log(`Toggle is now in the ${isAnd ? "AND" : "OR"} position.`);
    setIsAnd(isAnd);
  };

  const toggleSecondSearchBar = () => {
    console.log(`state: ${showSecondSearchBar}`);
    setShowSecondSearchBar((prev) => !prev);
  };

  return (
    <>
      <div className="search-with-button">
        <SearchBar
          games={games}
          type={primarySearchBar.type}
          placeHolder={primarySearchBar.placeHolder}
        />

        <Toggle
          isAnd={isAnd}
          handleToggleChange={handleToggleChange}
          transition={`${showSecondSearchBar ? "grow" : ""}`}
        />

        {/* Can be styled through prop as component never disappears */}
        <AddButton
          add={!showSecondSearchBar}
          onClick={toggleSecondSearchBar}
          className={`${showSecondSearchBar ? "shrink" : ""}`}
        />
      </div>

      <SearchBar
        games={games}
        type={secondarySearchBar.type}
        placeHolder={secondarySearchBar.placeHolder}
        transition={`search-bar-slide ${
          showSecondSearchBar ? "slide-down" : ""
        }`}
      />
    </>
  );
};

export default OfficialSearch;
