import { useEffect, useState } from "react";

import InvalidPage from "./InvalidPage/InvalidPage";
import SearchPage from "./SearchPage/SearchPage";

const regex: RegExp =
  /^https?:\/\/(?:www\.)?grayjayleagues\.com\/.*[?&]all_games=1(&|$).*/;

const App = () => {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Query for the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setCurrentUrl(tabs[0]?.url || "");
    });
  }, []);

  return (
    <div>
      {regex.test(currentUrl) ? <SearchPage/> : <InvalidPage />}
    </div>
  );
};

export default App;
