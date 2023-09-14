import { useMemo, useState } from "react";
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

  const [status, setStatus] = useState();

  const checkStatus = (monitors) => {
    if (!monitors) return;
    let operational = 0,
      totalKnown = 0;
    monitors.map((site) => {
      switch (site.status) {
        case "ok":
          operational++;
        case "down":
          totalKnown++;
          break;
        default:
          break;
      }
    });
    if (operational === totalKnown) {
      setStatus("ok");
    } else if (operational > 0) {
      setStatus("some");
    } else {
      setStatus("down");
    }
  };

  const setTotalStatus = () => {
    switch (status) {
      case "ok":
        return (
          <>
            <i className="expander ok" />
            全部服务<span className="ok">可用</span>
          </>
        );
      case "some":
        return (
          <>
            <i className="expander some" />
            部分服务<span className="some">中断</span>
          </>
        );
      case "down":
        return (
          <>
            <i className="expander down" />
            全部服务<span className="down">中断</span>
          </>
        );
      default:
        return (
          <>
            <i className="expander unknow" />
            正在获取……
          </>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div id="total-status">{setTotalStatus()}</div>
      </div>
      <div className="container">
        <div id="uptime">
          {apikeys.map((key) => (
            <UptimeRobot key={key} apikey={key} callback={checkStatus} />
          ))}
        </div>
        <div id="footer">
          <p>
            Powered by <Link to="https://status.org.cn/" text="STATUS.ORG.CN" />
            <br />
            Customized by <Link to="https://imken.moe" text="Imken" />, <Link to="https://github.com/immccn123/uptime-status/" text="source code" />
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
