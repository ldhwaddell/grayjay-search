import "./AndOrToggle.css";

interface Props {
  isAnd: boolean;
  handleToggleChange: (isAnd: boolean) => void;
}

const AndOrToggle = ({ isAnd, handleToggleChange }: Props) => {
  return (
    <>
      <div
        className="toggle-button-cover"
        onClick={() => handleToggleChange(!isAnd)}
      >
        <div className="button" id="button">
          <input type="checkbox" className="checkbox" />
          <div className="knobs">
            <span>AND</span>
          </div>
          <div className="layer"></div>
        </div>
      </div>
    </>
  );
};

export default AndOrToggle;
