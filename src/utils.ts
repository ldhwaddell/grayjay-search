// Various helper functions
const regex: RegExp =
  /^https?:\/\/(?:www\.)?grayjayleagues\.com\/.*[?&]all_games=1(&|$).*/;

export const isValidUrl = (url: string): boolean => regex.test(url);

export const getCurrentTab = async (): Promise<chrome.tabs.Tab> => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tab;
};
