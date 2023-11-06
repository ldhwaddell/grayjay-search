import "./InvalidPage.css";
import Header from "../Header/Header";

const InvalidPage = () => {
  return (
    <>
      <Header />
      <main className="invalid-main">
        <div className="invalid-message-container">
          <p className="invalid-text">
            This extension only works on the GrayJay Officials Games page!{" "}
          </p>
        </div>

        <div className="invalid-message-container">
          <p className="invalid-text">
            Navigate{" "}
            <a
              href="http://www.grayjayleagues.com/officials/games"
              target="_blank"
              rel="noopener noreferrer"
              className="invalid-link"
            >
              here
            </a>{" "}
            and make sure "All Games" is selected:
          </p>
        </div>

        <img
          className="invalid-img"
          src="./assets/page-hint.png"
          alt="Visual example of the 'All Games' option being selected"
        />
      </main>
    </>
  );
};

export default InvalidPage;
