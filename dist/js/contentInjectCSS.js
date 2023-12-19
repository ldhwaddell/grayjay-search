(()=>{"use strict";window.addEventListener("load",(function(){return n=document.createElement("style"),document.head.querySelector(".matches-tooltip-style")||(n.classList.add("matches-tooltip-style"),n.appendChild(document.createTextNode('\n    .matches-tooltip-container {\n      visibility: hidden;\n      color: black;\n      text-align: center;\n      border-radius: 4px;\n      position: absolute;\n      z-index: 100;\n      bottom: 30px;\n      left: 50%;\n      background-color: #fff;\n      transform: translateX(-50%);\n      white-space: nowrap;\n      width: 280px;\n      border: 2px solid #0b3e80;\n    }\n    \n    .matches-tooltip-header-container {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      background-color: #0b3e80;\n      height: 30px;\n    }\n    \n    .matches-tooltip-header-container h1 {\n      font-family: "Montserrat", sans-serif;\n      font-weight: 600;\n      font-size: 16px;\n      color: #fff;\n      margin: 0;\n    }\n    \n    .official-inputs {\n      padding: 5px;\n      margin: 0;\n    }\n    \n    .official-inputs label {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      font-size: 14px;\n      margin: 0;\n      padding: 0;\n    }\n    \n    .official-inputs input[type="text"] {\n      margin-left: 10px;\n      margin-bottom: 5px;\n      padding: 5px 10px;\n      width: 160px;\n    }\n    \n    .matches-official {\n      border: 2px solid #49a949;\n      border-radius: 4px;\n      background-color: #7dc67d;\n    }\n    \n    .official-inputs label:last-child input[type="text"] {\n      margin-bottom: 0;\n    }\n    \n    .matches-tooltip-trigger:hover + .matches-tooltip-container {\n      visibility: visible;\n    }\n    \n    .matches-tooltip-container::after {\n      content: "";\n      position: absolute;\n      bottom: -10px;\n      left: 50%;\n      transform: translateX(-50%);\n      border-left: 10px solid transparent;\n      border-right: 10px solid transparent;\n      border-top: 10px solid #0b3e80;\n    }\n    ')),document.head.appendChild(n)),void document.head.appendChild(n);var n}))})();