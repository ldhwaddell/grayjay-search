import "./EditSearchBarButton.css";

interface Props {
  add: boolean;
  onClick: () => void;
}

const EditSearchButton = ({ add, onClick }: Props) => {
  return (
    <button className="pushable" onClick={onClick}>
      <span className="shadow"></span>
      <span className="edge"></span>
      <span className="front">{add ? "+" : "-"}</span>
    </button>
  );
};

export default EditSearchButton;
