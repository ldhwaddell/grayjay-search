// Various helper functions
const regex: RegExp =
  /^https?:\/\/(?:www\.)?grayjayleagues\.com\/.*[?&]all_games=1(&|$).*/;

export const isValidUrl = (url: string): boolean => regex.test(url);
