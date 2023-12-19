import { useEffect, useState } from "react";

import InvalidPage from "./Pages/InvalidPage/InvalidPage";
import SearchPage from "./Pages/SearchPage/SearchPage";

import { Cache } from "./Cache";
import { isValidUrl, getCurrentTab } from "./utils";

import { GameDataRecord } from "./types";

const Popup = () => {
  const [onValidPage, setOnValidPage] = useState<boolean>(false);
  const [games, setGames] = useState<GameDataRecord>({});

  useEffect(() => {
    const checkValidUrl = async () => {
      try {
        const tab = await getCurrentTab();
        const valid: boolean = !!tab.url && isValidUrl(tab.url);

        if (valid) {
          const games: GameDataRecord = await Cache.get("games");
          setGames(games);
          setOnValidPage(valid);
        }
      } catch (error) {
        console.error("Error:", JSON.stringify(error));
      }
    };

    checkValidUrl();
  }, []);

  return <> {onValidPage ? <SearchPage games={games} /> : <InvalidPage />} </>;
};

export default Popup;
