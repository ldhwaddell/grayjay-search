const injectCSS = () => {
  const tooltipStyle = document.createElement("style") as HTMLStyleElement;
  const tooltipCSS = `
    .matches-tooltip-container {
      visibility: hidden;
      color: black;
      text-align: center;
      border-radius: 4px;
      position: absolute;
      z-index: 100;
      bottom: 30px;
      left: 50%;
      background-color: #fff;
      transform: translateX(-50%);
      white-space: nowrap;
      width: 280px;
      border: 2px solid #0b3e80;
    }
    
    .matches-tooltip-header-container {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #0b3e80;
      height: 30px;
    }
    
    .matches-tooltip-header-container h1 {
      font-family: "Montserrat", sans-serif;
      font-weight: 600;
      font-size: 16px;
      color: #fff;
      margin: 0;
    }
    
    .official-inputs {
      padding: 5px;
      margin: 0;
    }
    
    .official-inputs label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      margin: 0;
      padding: 0;
    }
    
    .official-inputs input[type="text"] {
      margin-left: 10px;
      margin-bottom: 5px;
      padding: 5px 10px;
      width: 160px;
    }
    
    .matches-official {
      border: 2px solid #49a949;
      border-radius: 4px;
      background-color: #7dc67d;
    }
    
    .official-inputs label:last-child input[type="text"] {
      margin-bottom: 0;
    }
    
    .matches-tooltip-trigger:hover + .matches-tooltip-container {
      visibility: visible;
    }
    
    .matches-tooltip-container::after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid #0b3e80;
    }
    `;

  // Check if the style tag already exists to prevent duplicate tags
  if (!document.head.querySelector(".matches-tooltip-style")) {
    tooltipStyle.classList.add("matches-tooltip-style");
    tooltipStyle.appendChild(document.createTextNode(tooltipCSS));

    // Append the style element to the head
    document.head.appendChild(tooltipStyle);
  }
  document.head.appendChild(tooltipStyle);
};

window.addEventListener("load", () => injectCSS());

export {};