import { useEffect, useMemo, useState } from "react";
import Link from "./link";
import Header from "./header";
import UptimeRobot from "./uptimerobot";

const LOADING = Symbol();
const OK = Symbol()
const DOWN = Symbol();
const SOME = Symbol();

const App = () => {
  const apikeys = useMemo(() => {
    const { ApiKeys } = window.Config;
    if (Array.isArray(ApiKeys)) return ApiKeys;
    if (typeof ApiKeys === "string") return [ApiKeys];
    return [];
  }, []);

  const [monitorStatus, setMonitorStatus] = useState(apikeys.map(() => null));

  const status = monitorStatus.some((x) => x === null)
    ? LOADING
    : monitorStatus.every((x) => x == "ok")
    ? OK
    : monitorStatus.every((x) => x == "down")
    ? DOWN
    : SOME;

  const checkStatusMaker = (index) => {
    return async (monitor) => {
      if (!monitor) return;
      let operational = 0,
        down = 0;

      monitor.forEach((site) => {
        switch (site.status) {
          case "ok":
            operational++;
            break;
          case "down":
            down++;
            break;
          default:
            break;
        }
      });

      // console.log(index, "callback", currentStatus);
      if (down === 0) {
        monitorStatus[index] = "ok";
      } else if (operational > 0) {
        monitorStatus[index] = "some";
      } else {
        monitorStatus[index] = "down";
      }
      setMonitorStatus(monitorStatus.slice());
    };
  };

  const setTotalStatus = () => {
    switch (status) {
      case OK:
        return (
          <>
            <i className="expander ok" />
            全部服务<span className="ok">可用</span>
          </>
        );
      case SOME:
        return (
          <>
            <i className="expander some" />
            部分服务<span className="some">中断</span>
          </>
        );
      case DOWN:
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
          {apikeys.map((key, index) => (
            <UptimeRobot
              key={key}
              apikey={key}
              callback={checkStatusMaker(index)}
            />
          ))}
        </div>
        <div id="footer">
          <p>
            Powered by <Link to="https://status.org.cn/" text="STATUS.ORG.CN" />
            <br />
            Customized by <Link to="https://imken.moe" text="Imken" />,{" "}
            <Link
              to="https://github.com/immccn123/uptime-status/"
              text="source code"
            />
          </p>
        </div>
      </div>
    </>
  );
};

export default App;
