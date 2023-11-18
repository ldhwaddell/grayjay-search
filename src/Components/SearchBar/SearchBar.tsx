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
}

const SearchBar = ({ games, searchType }: Props) => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const onChangeHandler = (text: string) => {
    if (text.length > 0) {
      const regex = new RegExp(text, "gi");
      const matches = games.reduce((acc: Set<string>, game: GameData) => {
        const match = game[searchType].match(regex);
        if (match) {
          acc.add(game[searchType]);
        }
        return acc;
      }, new Set<string>());

      setSuggestions(Array.from(matches));
    } else {
      setSuggestions([]);
    }

    setText(text);
  };

  console.log(suggestions);

  return (
    <>
      <input
        type="text"
        onChange={(e) => onChangeHandler(e.target.value)}
        value={text}
      />
    </>
  );
};

export default SearchBar;
