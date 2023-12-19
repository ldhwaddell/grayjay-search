import { useState, useEffect } from "react";

import "./SearchBar.css";

import { GameDataRecord, Official } from "../../types";

interface Props {
  games: GameDataRecord;
  queryText: string;
  type: Official;
  placeHolder: string;
  handleOfficialChange: (official: Official, name: string) => void;
}

const SearchBar = ({
  games,
  queryText,
  type,
  placeHolder,
  handleOfficialChange,
}: Props) => {
  const [text, setText] = useState<string>(queryText);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const invalidNames: Set<string> = new Set(["- Not Set -", "N/A N/A"]);

  useEffect(() => {
    setText(queryText);
  }, [queryText]);

  const onChangeHandler = (text: string) => {
    if (text.length > 0 && games) {
      const regex = new RegExp(text, "gi");

      const matches = new Set<string>();

      for (const game of Object.values(games)) {
        if (!invalidNames.has(game[type]) && game[type].match(regex)) {
          matches.add(game[type]);
        }
      }

      // If no matches, let user know
      if (!matches.size) {
        setSuggestions(["No Matches"]);
        return;
      }

      // Otherwise set suggestions to matches
      setSuggestions(Array.from(matches));
    } else {
      // No text; set suggestions to empty array
      setSuggestions([]);
    }

    // update text in search bar
    setText(text);
  };

  const onSuggestHandler = (text: string) => {
    // Autocomplete click if a valid name
    if (text !== "No Matches") {
      handleOfficialChange(type, text);
      setText(text);
    }
    // Otherwise make "No matches" suggestion go away
    setSuggestions([]);
  };

  const resetQuery = () => {
    setText("");
    handleOfficialChange(type, "");
  };

  return (
    <div className="search-wrapper">
      <input
        type="text"
        onChange={(e) => onChangeHandler(e.target.value)}
        value={text}
        placeholder={placeHolder}
        className="search"
        onBlur={() => {
          setTimeout(() => {
            setSuggestions([]);
          }, 100);
        }}
      />
      <img
        src="/assets/x.png"
        alt="X icon"
        className="search-clear-icon"
        onClick={() => resetQuery()}
      />

      {suggestions.length > 0 && (
        <div className="suggestions-container">
          {suggestions.map((suggestion, i) => (
            <div
              key={i}
              className="suggestion"
              onClick={() => onSuggestHandler(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
