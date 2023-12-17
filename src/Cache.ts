import { GameData } from "./types";

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

  static addGames = async (gameData: GameData[]): Promise<void> => {
    const currentGames: GameData[] = (await this.get(GAME_CACHE_KEY)) || [];
    const updatedGames: GameData[] = [...currentGames, ...gameData];

    await this.update(GAME_CACHE_KEY, updatedGames);
  };

  // Make sure it handles case of adding/removing at same time
  static removeGames = async (gamesToRemove: number[]): Promise<void> => {
    // Fetch the current games from the cache
    const currentGames: GameData[] = await this.get(GAME_CACHE_KEY);

    // Filter out the games that need to be removed
    const updatedGames: GameData[] = currentGames.filter(
      (game) => !gamesToRemove.includes(game.id)
    );

    await this.update(GAME_CACHE_KEY, updatedGames);
  };
}
