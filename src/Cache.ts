const GAME_CACHE_KEY = "games";

export class Cache {
  static get = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([GAME_CACHE_KEY], (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        }

        resolve(result);
      });
    });
  };

  static update = (newGameData: any[] = [], gamesToRemove: any[] = []) => {};
}
