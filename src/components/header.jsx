import { useEffect } from "react";

const Header = () => {
  useEffect(() => {
    document.title = window.Config.SiteName;
  }, []);

  return (
    <div id="header">
      <div className="container">
        <h1 className="logo">{window.Config.SiteName}</h1>
        <h1 className="subtitle">{window.Config.Subtitle}</h1>
      </div>
    </div>
  );
};

export default Header;
