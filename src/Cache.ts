import { GameData, GameDataRecord } from "./types";

const GAME_CACHE_KEY: string = "games";

export class Cache {
  static get = async (key: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          const data = result[key] ?? null;
          resolve(data);
        }
      });
    });
  };

  static update = async (key: string, data: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: data }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  };

  static addGames = async (gameData: GameDataRecord): Promise<void> => {
    const currentGames: GameData[] = (await this.get(GAME_CACHE_KEY)) || {};

    await this.update(GAME_CACHE_KEY, { ...currentGames, ...gameData });
  };

  // Make sure it handles case of adding/removing at same time
  static removeGames = async (gamesToRemove: string[]): Promise<void> => {
    // Fetch the current games from the cache
    const currentGames: GameDataRecord = await this.get(GAME_CACHE_KEY);

    // Remove the specified games
    gamesToRemove.forEach((id) => {
      delete currentGames[id];
    });

    // Update the cache with the modified games object
    await this.update(GAME_CACHE_KEY, currentGames);
  };
}
