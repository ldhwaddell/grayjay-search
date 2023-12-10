import "./Toggle.css";

interface Props {
  handleClick: any;
}

const Toggle = ({ handleClick }: Props) => {
  return (
    <div className="toggle-button-cover">
      <div className="button" id="button" onClick={handleClick}>
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
