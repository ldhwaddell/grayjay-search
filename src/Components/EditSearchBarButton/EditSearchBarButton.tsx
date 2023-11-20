import "./EditSearchBarButton.css";

interface Props {
  add: boolean;
  onClick: () => void;
  className: string;
}

const EditSearchButton = ({ add, onClick, className }: Props) => {
  return (
    <button className={`pushable ${className}`} onClick={onClick}>
      <span className="edge"></span>
      <span className="front">{add ? "+" : "-"}</span>
    </button>
  );
};

export default EditSearchButton;
