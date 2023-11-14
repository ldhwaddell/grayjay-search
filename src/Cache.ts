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

const GAME_CACHE_KEY: string = "games";

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
