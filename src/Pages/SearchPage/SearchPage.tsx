import { useState, useEffect } from "react";

import Header from "../../Components/Header/Header";
import RadioButton from "../../Components/RadioButton/RadioButton";
import SearchBar from "../../Components/SearchBar/SearchBar";
import Toggle from "../../Components/Toggle/Toggle";
import ResetQueryButton from "../../Components/ResetQueryButton/ResetQueryButton";

import { Cache } from "../../Cache";
import { getCurrentTab, isQueryNull } from "../../utils";

import "./SearchPage.css";

import {
  GameData,
  Query,
  defaultQuery,
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
  const [query, setQuery] = useState<Query>(
    JSON.parse(JSON.stringify(defaultQuery))
  );

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const queryData: Query = await Cache.getQuery();
        // Only update query if one already exists
        if (Object.keys(queryData).length !== 0) {
          setQuery(queryData);
        }
      } catch (error) {
        console.error("Error fetching query data:", error);
      }
    };

    fetchQuery();
  }, []);

  useEffect(() => {
    const sendMessage = async () => {
      // Update query in cache
      await Cache.updateQuery(query);
      // Then send message
      const tab = await getCurrentTab();

      if (tab.id) {
        const message: QueryChangeMessage = { type: "QUERY_CHANGE" };
        chrome.tabs.sendMessage(tab.id, message);
      }
    };

    sendMessage();
  }, [query]);

  const handleQueryChange = (
    type: "referee" | "linesman",
    key: keyof RefereeQuery | keyof LinesmanQuery,
    value: string
  ) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      [type]: {
        ...prevQuery[type],
        [key]: value,
      },
    }));
  };

  const handleQueryReset = () => {
    if (!isQueryNull(query)) {
      setQuery(JSON.parse(JSON.stringify(defaultQuery)));
    }
  };

  const handleOfficialChange = (official: Official, name: string) => {
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

  return (
    <div className="container">
      <Header />

      <div className="search-with-toggle">
        <SearchBar
          games={games}
          queryText={query.referee.referee1}
          type="referee1"
          placeHolder="Referee #1"
          handleOfficialChange={handleOfficialChange}
        />

        <Toggle handleClick={() => handleToggleChange("referee")} />
      </div>

      <SearchBar
        games={games}
        queryText={query.referee.referee2}
        type="referee2"
        placeHolder="Referee #2"
        handleOfficialChange={handleOfficialChange}
      />

      {/* Find better way */}
      <div className="search-with-toggle" style={{ marginTop: -10 }}>
        <SearchBar
          games={games}
          queryText={query.linesman.linesman1}
          type="linesman1"
          placeHolder="Linesman #1"
          handleOfficialChange={handleOfficialChange}
        />
        <Toggle handleClick={() => handleToggleChange("linesman")} />
      </div>
      <SearchBar
        games={games}
        queryText={query.linesman.linesman2}
        type="linesman2"
        placeHolder="Linesman #2"
        handleOfficialChange={handleOfficialChange}
      />

      <div className="controls-container">
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
        <ResetQueryButton onClick={() => handleQueryReset()} />
      </div>
    </div>
  );
};

export default SearchPage;
