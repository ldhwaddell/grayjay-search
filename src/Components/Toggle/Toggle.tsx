import "./Toggle.css";

interface Props {
  isAnd: boolean;
  handleToggleChange: (isAnd: boolean) => void;
}

const Toggle = ({ isAnd, handleToggleChange }: Props) => {
  return (
    <div className="toggle-button-cover">
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
    </div>
  );
};

export default Toggle;
