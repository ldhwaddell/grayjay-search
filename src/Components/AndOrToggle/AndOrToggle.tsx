import "./AndOrToggle.css";

interface Props {
  isAnd: boolean;
  onToggle: (isAnd: boolean) => void;
}

const AndOrToggle = ({ isAnd, onToggle }: Props) => {
  const handleToggle = () => {
    onToggle(!isAnd);
  };
  
  return (
    <>
      <div className="toggle-button-cover" onClick={handleToggle}>
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
