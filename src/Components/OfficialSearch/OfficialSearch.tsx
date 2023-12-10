import { useState } from "react";

import SearchBar from "../../Components/SearchBar/SearchBar";

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

  const handleToggleChange = (isAnd: boolean) => {
    const { type } = primarySearchBar;
    setIsAnd(isAnd);
    handleConditionChange(type, isAnd ? "AND" : "OR");
  };

  return (
    <>
      <div className="search-with-toggle">
        <SearchBar
          games={games}
          type={primarySearchBar.type}
          placeHolder={primarySearchBar.placeHolder}
          handleOfficialChange={handleOfficialChange}
        />

        {/* <Toggle isAnd={isAnd} handleToggleChange={handleToggleChange} /> */}
      </div>

      <div className="search-bar-secondary">
        <SearchBar
          games={games}
          type={secondarySearchBar.type}
          placeHolder={secondarySearchBar.placeHolder}
          handleOfficialChange={handleOfficialChange}
        />
      </div>
    </>
  );
};

export default OfficialSearch;
