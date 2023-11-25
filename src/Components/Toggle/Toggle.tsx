import "./Toggle.css";

interface Props {
  isAnd: boolean;
  handleToggleChange: (isAnd: boolean) => void;
  transition: string;
}

const Toggle = ({ isAnd, handleToggleChange, transition }: Props) => {
  return (
    <div className={`toggle-button-cover ${transition}`}>
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
