import { useState } from "react";

import "./SearchBar.css";

// Define specific keys that can be used for searching.
type RefereeType =
  | "referee1"
  | "referee2"
  | "linesPerson1"
  | "linesPerson2"
  | "timeKeeper1"
  | "timeKeeper2";

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
  searchType: RefereeType;
  placeHolder: string;
  transition?: string;
}

const SearchBar = ({ games, searchType, placeHolder, transition }: Props) => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const onChangeHandler = (text: string) => {
    if (text.length > 0) {
      const regex = new RegExp(text, "gi");

      const matches = games.reduce((acc: Set<string>, game: GameData) => {
        // Only add matches that aren't in "- Not Set -"
        if (
          game[searchType] !== "- Not Set -" &&
          game[searchType].match(regex)
        ) {
          acc.add(game[searchType]);
        }
        return acc;
      }, new Set<string>());

      if (!matches.size) {
        setSuggestions(["No Matches"]);
        return;
      }

      setSuggestions(Array.from(matches));
    } else {
      setSuggestions([]);
    }

    setText(text);
  };

  const onSuggestHandler = (text: string) => {
    if (text !== "No Matches") {
      setText(text);
    }
    setSuggestions([]);
  };

  return (
    <div className={`search-wrapper ${transition}`}>
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
      {suggestions && suggestions.length > 0 && (
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
