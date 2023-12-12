import { GameData, Query } from "./types";

const GAME_CACHE_KEY: string = "games";
const QUERY_CACHE_KEY: string = "query";

export class Cache {
  static get = async (key: string = GAME_CACHE_KEY): Promise<GameData[]> => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          const data: GameData[] = result[key] ?? [];
          resolve(data);
        }
      });
    });
  };

  static getQuery = async (key: string = QUERY_CACHE_KEY): Promise<Query> => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          const data: Query = result[key] ?? {};
          resolve(data);
        }
      });
    });
  };

  static updateQuery = async (newQuery: Query): Promise<void> => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [QUERY_CACHE_KEY]: newQuery }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  };

  static add = async (gameData: GameData[]): Promise<void> => {
    if (!gameData || !gameData.length) {
      return;
    }

    const currentGames: GameData[] = await this.get();

    const updatedGames: GameData[] = [...currentGames, ...gameData];

    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [GAME_CACHE_KEY]: updatedGames }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        }
        resolve();
      });
    });
  };

  // // Make sure it handles case of adding/removing at same time
  static remove = async (gamesToRemove: number[]): Promise<void> => {
    // Return early if there are no games to remove
    if (!gamesToRemove || !gamesToRemove.length) {
      return;
    }

    // Fetch the current games from the cache
    const currentGames: GameData[] = await this.get();

    // Filter out the games that need to be removed
    const updatedGames: GameData[] = currentGames.filter(
      (game) => !gamesToRemove.includes(game.id)
    );

    // Update the cache with the filtered list
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [GAME_CACHE_KEY]: updatedGames }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        }
        resolve();
      });
    });
  };
}
