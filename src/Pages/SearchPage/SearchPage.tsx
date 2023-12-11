import { useState, useEffect } from "react";

import Header from "../../Components/Header/Header";
import RadioButton from "../../Components/RadioButton/RadioButton";
import SearchBar from "../../Components/SearchBar/SearchBar";
import Toggle from "../../Components/Toggle/Toggle";

import { getCurrentTab } from "../../utils";

import "./SearchPage.css";

import {
  GameData,
  Query,
  RefereeQuery,
  LinesmanQuery,
  Official,
  Condition,
  QueryChangeMessage,
} from "../../types";

interface Props {
  games: GameData[];
}

const SearchPage = ({ games }: Props) => {
  const [query, setQuery] = useState<Query>({
    referee: {
      referee1: null,
      referee2: null,
      condition: "AND",
    },
    linesman: {
      linesman1: null,
      linesman2: null,
      condition: "AND",
    },
    matches: "Highlight",
  });

  const handleQueryChange = (
    type: "referee" | "linesman",
    key: keyof RefereeQuery | keyof LinesmanQuery,
    value: string | null
  ) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      [type]: {
        ...prevQuery[type],
        [key]: value,
      },
    }));
  };

  const handleOfficialChange = (official: Official, name: string | null) => {
    const type: "referee" | "linesman" = official.startsWith("linesman")
      ? "linesman"
      : "referee";

    handleQueryChange(type, official, name);
  };

  const handleToggleChange = (official: "referee" | "linesman") => {
    const toggle: Condition =
      query[official].condition === "AND" ? "OR" : "AND";

    handleQueryChange(official, "condition", toggle);
  };

  const handleMatchChange = (match: string) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      matches: match,
    }));
  };

  useEffect(() => {
    const sendMessage = async (query: Query) => {
      const tab = await getCurrentTab();

      if (tab.id) {
        const message: QueryChangeMessage = { type: "QUERY_CHANGE", query };
        chrome.tabs.sendMessage(tab.id, message);
      }
    };

    sendMessage(query);
  }, [query]);

  return (
    <div className="container">
      <Header />

      <div className="search-with-toggle">
        <SearchBar
          games={games}
          type="referee1"
          placeHolder="Referee #1"
          handleOfficialChange={handleOfficialChange}
        />

        <Toggle handleClick={() => handleToggleChange("referee")} />
      </div>

      <SearchBar
        games={games}
        type="referee2"
        placeHolder="Referee #2"
        handleOfficialChange={handleOfficialChange}
      />

      {/* Find better way */}
      <div className="search-with-toggle" style={{ marginTop: -10 }}>
        <SearchBar
          games={games}
          type="linesman1"
          placeHolder="Linesman #1"
          handleOfficialChange={handleOfficialChange}
        />
        <Toggle handleClick={() => handleToggleChange("linesman")} />
      </div>
      <SearchBar
        games={games}
        type="linesman2"
        placeHolder="Linesman #2"
        handleOfficialChange={handleOfficialChange}
      />

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
    </div>
  );
};

export default SearchPage;
