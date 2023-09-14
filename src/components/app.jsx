import { useMemo } from "react";
import Link from "./link";
import Header from "./header";
import UptimeRobot from "./uptimerobot";

function App() {
  const apikeys = useMemo(() => {
    const { ApiKeys } = window.Config;
    if (Array.isArray(ApiKeys)) return ApiKeys;
    if (typeof ApiKeys === "string") return [ApiKeys];
    return [];
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <div id="uptime">
          {apikeys.map((key) => (
            <UptimeRobot key={key} apikey={key} />
          ))}
        </div>
        <div id="footer">
          <p>
            Powered by <Link to="https://status.org.cn/" text="STATUS.ORG.CN" /><br />
            Customized by <Link to="https://imken.moe" text="Imken" />
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
