import "./AndOrToggle.css";

interface Props {
  isAnd: boolean;
  handleToggleChange: (isAnd: boolean) => void;
}

const AndOrToggle = ({ isAnd, handleToggleChange }: Props) => {
  return (
    <div
      className="button"
      id="button"
      onClick={() => handleToggleChange(!isAnd)}
    >
      <input type="checkbox" className="checkbox" />
      <div className="knobs">
        <span>AND</span>
      </div>
      <div className="layer"></div>
    </div>
  );
};

export default AndOrToggle;
