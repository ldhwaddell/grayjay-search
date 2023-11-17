import "./InvalidPage.css";
import Header from "../../Components/Header/Header";

const InvalidPage = () => {
  return (
    <>
      <Header />
      <div className="message-container">
        <p className="text">
          This extension only works on the GrayJay Officials Games page!{" "}
        </p>
      </div>

      <div className="message-container">
        <p className="text">
          Navigate{" "}
          <a
            href="http://www.grayjayleagues.com/officials/games"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            here
          </a>{" "}
          and make sure "All Games" is selected:
        </p>
      </div>

      <img
        className="img"
        src="./assets/page-hint.png"
        alt="Visual example of the 'All Games' option being selected"
      />
    </>
  );
};

export default InvalidPage;
