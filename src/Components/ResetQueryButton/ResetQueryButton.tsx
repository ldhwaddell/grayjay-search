import "./ResetQueryButton.css";

interface Props {
  onClick?: () => void;
}

const AddButton = ({ onClick }: Props) => {
  return (
    <button className="pushable" onClick={onClick}>
      <span className="edge"></span>
      <span className="front">Reset Query</span>
    </button>
  );
};

export default AddButton;
