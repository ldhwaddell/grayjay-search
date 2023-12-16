import "./ToggleConditionButton.css";

interface Props {
  isAnd: boolean;
  handleClick: any;
}

const ToggleConditionButton = ({ isAnd, handleClick }: Props) => {
  const edgeClass = isAnd ? "toggle-edge-blue" : "toggle-edge-red";
  const frontClass = isAnd ? "toggle-front-blue" : "toggle-front-red";

  return (
    <button className="toggle-pushable" onClick={handleClick}>
      <span className={`toggle-edge ${edgeClass}`}></span>
      <span className={`toggle-front ${frontClass}`}>
        {isAnd ? "AND" : "OR"}
      </span>
    </button>
  );
};

export default ToggleConditionButton;
