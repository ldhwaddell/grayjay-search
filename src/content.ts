const scrapeLinks = () => {
  const gameDivs = Array.from(document.querySelectorAll(".single-game"));

  const links = gameDivs.flatMap((div) =>
    Array.from(div.querySelectorAll("a[href]")).map(
      (link) => (link as HTMLAnchorElement).href
    )
  );

  chrome.runtime.sendMessage({ type: "PROCESS_LINKS", links });
};

// Content does not update frequently
// scraping on page load should provide recent enough content
window.addEventListener("load", scrapeLinks);

export {};
