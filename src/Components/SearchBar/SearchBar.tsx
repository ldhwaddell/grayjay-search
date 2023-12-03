import { useState } from "react";

import "./SearchBar.css";

import { GameData, Official } from "../../types";

interface Props {
  games: GameData[];
  type: Official;
  placeHolder: string;
  transition?: string;
  handleOfficialChange: (official: Official, name: string) => void;
}

const SearchBar = ({
  games,
  type,
  placeHolder,
  transition,
  handleOfficialChange,
}: Props) => {
  const [text, setText] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const onChangeHandler = (text: string) => {
    if (text.length > 0) {
      const regex = new RegExp(text, "gi");

      const matches = games.reduce((acc: Set<string>, game: GameData) => {
        // Only add matches that aren't "- Not Set -"
        if (game[type] !== "- Not Set -" && game[type].match(regex)) {
          acc.add(game[type]);
        }

        return acc;
      }, new Set<string>());

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
