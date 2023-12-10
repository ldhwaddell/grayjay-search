import ReactDOM from "react-dom/client";
import Popup from "./Popup";
import "./Popup.css";

const root = document.createElement("div");
document.body.appendChild(root);
const rootDiv = ReactDOM.createRoot(root);

rootDiv.render(<Popup />);
