const GAME_CACHE_KEY = "games";

export class Cache {
  static get = async (key = [GAME_CACHE_KEY]): Promise<any> => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        }

        resolve(result);
      });
    });
  };

  // handle async adding
  // handle errors gracefully
  static add = (data: any[]) => {};

  // just iterate over both lists, try to add the data, catch error on existing key
  // just to delete data, catch error in deletion
  static update = (newGameData: any[] = [], gamesToRemove: any[] = []) => {};

  // Make sure it handles case of adding/removing at same time
  static remove = (gamesToRemove: any[] = []) => {};
}
