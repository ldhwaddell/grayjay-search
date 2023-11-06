function checkForCorrectPage(url: string) {
    if (/^https?:\/\/(?:www\.)?grayjayleagues\.com\/.*[?&]all_games=1(&|$).*/.test(url)) {
      console.log("hi");
    }
  }
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
      checkForCorrectPage(tab.url);
    }
  });
  
  chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      // Make sure the tab has a URL property before trying to check it
      if (tab.url) {
        checkForCorrectPage(tab.url);
      }
    });
  });
  
  export {};
  