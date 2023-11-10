const scrapeLinks = () => {
  // Reset the storage last scrpae flag if called on a reload
  const gameDivs = Array.from(document.querySelectorAll(".single-game"));

  const links = gameDivs.flatMap((div) =>
    Array.from(div.querySelectorAll("a[href]")).map(
      (link) => (link as HTMLAnchorElement).href
    )
  );

  chrome.runtime.sendMessage({ type: "PROCESS_LINKS", links });
  // Add event listenter to recall scrape links if failure
};

// Content does not update frequently
// scraping on page load should provide recent enough content
window.addEventListener("load", scrapeLinks);

export {};