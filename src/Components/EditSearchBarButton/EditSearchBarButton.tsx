import { useState } from "react";
import "./EditSearchBarButton.css";

interface Props {
  add: boolean;
  onClick: () => void;
}

const EditSearchButton = ({ add, onClick }: Props) => {
  const [isShrunk, setIsShrunk] = useState(false);

  const handleClick = () => {
    onClick();
    setIsShrunk(!isShrunk);
  };

  return (
    <button
      className={`pushable ${isShrunk ? "shrink" : ""}`}
      onClick={handleClick}
    >
      <span className="edge"></span>
      <span className="front">{add ? "+" : "-"}</span>
    </button>
  );
};

export default EditSearchButton;
