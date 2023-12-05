import { useState } from "react";

import SearchBar from "../../Components/SearchBar/SearchBar";
import AddButton from "../AddButton/AddButton";

import Toggle from "../Toggle/Toggle";

import "./OfficialSearch.css";

import { GameData, Official, Condition } from "../../types";

interface Props {
  games: GameData[];
  primarySearchBar: {
    type: Official;
    placeHolder: string;
  };
  secondarySearchBar: {
    type: Official;
    placeHolder: string;
  };
  handleOfficialChange: (official: Official, name: string | null) => void;
  handleConditionChange: (official: Official, condition: Condition) => void;
}

const OfficialSearch = ({
  games,
  primarySearchBar,
  secondarySearchBar,
  handleOfficialChange,
  handleConditionChange,
}: Props) => {
  const [isAnd, setIsAnd] = useState(true);
  const [showSecondSearchBar, setShowSecondSearchBar] = useState(false);

  const handleToggleChange = (isAnd: boolean) => {
    const { type } = primarySearchBar;
    setIsAnd(isAnd);
    handleConditionChange(type, isAnd ? "AND" : "OR");
  };

  const toggleSecondSearchBar = () => {
    if (!showSecondSearchBar) {
      const { type } = primarySearchBar;
      handleOfficialChange(type, null);
      handleConditionChange(type, "OR");
    }

    setShowSecondSearchBar((prev) => !prev);
  };

  return (
    <>
      <div className="search-with-button">
        <SearchBar
          games={games}
          type={primarySearchBar.type}
          placeHolder={primarySearchBar.placeHolder}
          handleOfficialChange={handleOfficialChange}
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
        handleOfficialChange={handleOfficialChange}
      />
    </>
  );
};

export default OfficialSearch;
