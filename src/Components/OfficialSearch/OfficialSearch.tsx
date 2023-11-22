import React, { useState } from "react";

import SearchBar from "../../Components/SearchBar/SearchBar";
import EditSearchButton from "../../Components/EditSearchBarButton/EditSearchBarButton";

import AndOrToggle from "../../Components/AndOrToggle/AndOrToggle";

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
  searchBar1: {
    searchType: RefereeType;
    placeHolder: string;
  };
  searchBar2: {
    searchType: RefereeType;
    placeHolder: string;
  };
}

/**
 * Props:
 * - some sort of query props that is held in SearchPage.tsx
 * - games: all the games for the search to use
 *
 */

const OfficialSearch = ({ games, searchBar1, searchBar2 }: Props) => {
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
          searchType={searchBar1.searchType}
          placeHolder={searchBar1.placeHolder}
        />

        <AndOrToggle
          isAnd={isAnd}
          handleToggleChange={handleToggleChange}
          transition={`${showSecondSearchBar ? "grow" : ""}`}
        />

        {/* Can be styled through prop as component never disappears */}
        <EditSearchButton
          add={!showSecondSearchBar}
          onClick={toggleSecondSearchBar}
          className={`${showSecondSearchBar ? "shrink" : ""}`}
        />
      </div>

      <SearchBar
        games={games}
        searchType={searchBar2.searchType}
        placeHolder={searchBar2.placeHolder}
        transition={`search-bar-slide ${
          showSecondSearchBar ? "slide-down" : ""
        }`}
      />
    </>
  );
};

export default OfficialSearch;
