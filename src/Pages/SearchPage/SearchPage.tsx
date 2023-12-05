import { useState } from "react";

import Header from "../../Components/Header/Header";
import OfficialSearch from "../../Components/OfficialSearch/OfficialSearch";
import RadioButton from "../../Components/RadioButton/RadioButton";

import "./SearchPage.css";

import {
  GameData,
  Query,
  RefereeQuery,
  LinesmanQuery,
  Official,
  Condition,
} from "../../types";

interface Props {
  games: GameData[];
}

const SearchPage = ({ games }: Props) => {
  const [query, setQuery] = useState<Query>({
    referee: {
      referee1: null,
      referee2: null,
      condition: "OR",
    },
    linesman: {
      linesman1: null,
      linesman2: null,
      condition: "OR",
    },
    matches: "Highlight",
  });

  const handleQueryChange = (
    type: "referee" | "linesman",
    field: keyof RefereeQuery | keyof LinesmanQuery,
    value: string | null
  ) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      [type]: {
        ...prevQuery[type],
        [field]: value,
      },
    }));
  };

  const handleOfficialChange = (official: Official, name: string | null) => {
    const type: "referee" | "linesman" = official.startsWith("linesman")
      ? "linesman"
      : "referee";

    handleQueryChange(type, official, name);
  };

  const handleConditionChange = (official: Official, condition: Condition) => {
    const type: "referee" | "linesman" = official.startsWith("linesman")
      ? "linesman"
      : "referee";
    handleQueryChange(type, "condition", condition);
  };

  const handleMatchChange = (match: string) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      matches: match,
    }));
  };

  console.log(`QUERY: ${JSON.stringify(query)}`);

  // SEND MESSAGE WITH QUERY AND OUTPUT OPTION

  return (
    <>
      <Header />

      <OfficialSearch
        games={games}
        primarySearchBar={{ type: "referee1", placeHolder: "Referee #1" }}
        secondarySearchBar={{ type: "referee2", placeHolder: "Referee #2" }}
        handleOfficialChange={handleOfficialChange}
        handleConditionChange={handleConditionChange}
      />
      {/* <OfficialSearch
        games={games}
        primarySearchBar={{ type: "linesPerson1", placeHolder: "Linesman #1" }}
        secondarySearchBar={{
          type: "linesPerson2",
          placeHolder: "Linesman #2",
        }}
      /> */}

      <div className="radio-button-container">
        <RadioButton
          text="Highlight"
          tooltipText="Highlight games that match your search"
          checked={query.matches === "Highlight"}
          onChange={() => handleMatchChange("Highlight")}
        />

        <RadioButton
          text="Display"
          tooltipText="Only display games that match your search"
          checked={query.matches === "Display"}
          onChange={() => handleMatchChange("Display")}
        />
      </div>
    </>
  );
};

export default SearchPage;
