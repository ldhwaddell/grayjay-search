import { useState, useEffect, useRef } from "react";

import Header from "../../Components/Header/Header";
import RadioButton from "../../Components/RadioButton/RadioButton";
import SearchBar from "../../Components/SearchBar/SearchBar";
import ToggleConditionButton from "../../Components/ToggleConditionButton/ToggleConditionButton";
import ResetQueryButton from "../../Components/ResetQueryButton/ResetQueryButton";

import { Cache } from "../../cache";
import { clone, getCurrentTab } from "../../utils";
import useDeepCompareEffect from "use-deep-compare-effect";

import "./SearchPage.css";

import {
  GameDataRecord,
  Query,
  defaultQuery,
  Official,
  QueryChangeMessage,
} from "../../types";

interface Props {
  games: GameDataRecord;
}

const SearchPage = ({ games }: Props) => {
  const [query, setQuery] = useState<Query>(clone(defaultQuery));
  const isInitialMount = useRef(true);

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const queryData: Query = await Cache.get("query");
        // Only update query if one already exists
        if (queryData) {
          setQuery(queryData);
        }
      } catch (error) {
        console.error("Error fetching query data:", error);
      }
    };

    fetchQuery();
  }, []);

  useDeepCompareEffect(() => {
    // Skip initial render to doesn't trigger twice
    if (isInitialMount.current) {
      // Skip the first run of the effect
      isInitialMount.current = false;
      return;
    }

    const sendMessage = async () => {
      // Update query in cache
      await Cache.update("query", query);
      // Then send message
      const tab = await getCurrentTab();

      if (!tab.id) {
        console.warn("Unable to access tab ID to visualize query change");
        return;
      }

      const message: QueryChangeMessage = { type: "QUERY_CHANGE" };
      chrome.tabs.sendMessage(tab.id, message);
    };

    sendMessage();
  }, [query]);

  const handleQueryReset = () => {
    setQuery(clone(defaultQuery));
  };

  const handleOfficialChange = (official: Official, name: string) => {
    const type: "referee" | "linesman" = official.startsWith("linesman")
      ? "linesman"
      : "referee";

    setQuery((prevQuery) => ({
      ...prevQuery,
      [type]: {
        ...prevQuery[type],
        [official]: name,
      },
    }));
  };

  const handleToggleChange = (official: "referee" | "linesman") => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      [official]: {
        ...prevQuery[official],
        condition: !query[official].condition,
      },
    }));
  };

  const handleMatchChange = (match: "Highlight" | "Display") => {
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

        <ToggleConditionButton
          isAnd={query.referee.condition}
          handleClick={() => handleToggleChange("referee")}
        />
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
        <ToggleConditionButton
          isAnd={query.linesman.condition}
          handleClick={() => handleToggleChange("linesman")}
        />
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
