(()=>{"use strict";window.addEventListener("load",(function(){var e=Array.from(document.querySelectorAll(".single-game")).flatMap((function(e){return Array.from(e.querySelectorAll("a[href]")).map((function(e){return e.href}))}));chrome.runtime.sendMessage({type:"PROCESS_LINKS",links:e})}))})();