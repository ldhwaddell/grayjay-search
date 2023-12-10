import { useEffect, useState } from "react";

import InvalidPage from "./Pages/InvalidPage/InvalidPage";
import SearchPage from "./Pages/SearchPage/SearchPage";

import { Cache } from "./Cache";
import { isValidUrl } from "./utils";

import { GameData } from "./types";

const Popup = () => {
  const [onValidPage, setOnValidPage] = useState<boolean | null>(null);
  const [games, setGames] = useState<GameData[]>([]);

  useEffect(() => {
    const checkValidUrl = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        const valid: boolean = !!tab.url && isValidUrl(tab.url);

        if (valid) {
          const games: GameData[] = await Cache.get();
          setGames(games);
        }

        setOnValidPage(valid);
      } catch (error) {
        console.error("Error:", JSON.stringify(error));
        setOnValidPage(false);
      }
    };

    checkValidUrl();
  }, []);

  // If page has not yet been verified, show invalid page
  if (onValidPage === null) {
    return <InvalidPage />;
  }

  return <>{onValidPage ? <SearchPage games={games} /> : <InvalidPage />}</>;
};

export default Popup;
