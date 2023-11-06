import { useEffect, useState } from "react";

import InvalidPage from "./InvalidPage/InvalidPage";

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
      {regex.test(currentUrl) ? <p>You are on the page!</p> : <InvalidPage />}
    </div>
  );
};

export default App;
