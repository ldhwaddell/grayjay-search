import "./RadioButton.css";

interface Props {
  text: string;
  tooltipText: string;
  checked: boolean;
  onChange: () => void;
}

const RadioButton = ({ text, tooltipText, checked, onChange }: Props) => {
  return (
    <div className="radio-container">
      <input
        type="radio"
        id={text}
        name="radio"
        className="radio-input"
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={text} className="radio-label">
        {text}
      </label>

      <div className="tooltip">
        <img
          className="img"
          src="/assets/question-mark.png"
          alt="A question mark"
        />
        <span className="tooltiptext">{tooltipText}</span>
      </div>
    </div>
  );
};

export default RadioButton;
