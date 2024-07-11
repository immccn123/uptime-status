import { useMemo, useState } from "react";
import Link from "./link";
import Header from "./header";
import UptimeRobot from "./uptimerobot";
import { match } from "ts-pattern";

const LOADING = Symbol();
const OK = Symbol();
const DOWN = Symbol();
const SOME = Symbol();

const App = () => {
  /** @type {string[]} */
  const apikeys = useMemo(() => {
    const { ApiKeys } = window.Config;
    if (Array.isArray(ApiKeys)) return ApiKeys;
    if (typeof ApiKeys === "string") return [ApiKeys];
    return [];
  }, []);

  const [monitorStatus, setMonitorStatus] = useState(
    /** @type {("ok" | "down" | null)[]} */(new Array(apikeys.length))
  );

  const status = match(monitorStatus)
    .when(x => x.some(x => x === null), () => LOADING)
    .when(x => x.every(x => x === "ok"), () => OK)
    .when(x => x.every(x => x === "down"), () => OK)
    .otherwise(() => SOME);

  const checkStatusMaker = index => {
    return async monitor => {
      if (!monitor) return;
      let operational = 0, down = 0;

      monitor.forEach(({ status }) =>
        match(status)
          .with("ok", () => operational++)
          .with("down", () => down++)
          .exhaustive()
      );

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

  const setTotalStatus = () =>
    match(status)
      .with(OK, () =>
        <>
          <i className="expander ok" />
          全部服务<span className="ok">可用</span>
        </>
      )
      .with(SOME, () =>
        <>
          <i className="expander some" />
          部分服务<span className="some">中断</span>
        </>
      )
      .with(DOWN, () =>
        <>
          <i className="expander down" />
          全部服务<span className="down">中断</span>
        </>
      )
      .otherwise(() =>
        <>
          <i className="expander unknow" />
          正在获取……
        </>
      );

  return (
    <>
      <Header />
      <div className="container">
        <div id="total-status">{setTotalStatus()}</div>
      </div>
      <div className="container">
        <div id="uptime">
          {apikeys.map((key, index) => (
            <UptimeRobot key={key} apikey={key} callback={checkStatusMaker(index)} />
          ))}
        </div>
        <div id="footer">
          <p>
            Powered by <Link to="https://status.org.cn/" text="STATUS.ORG.CN" />
            <br />
            Customized by <Link to="https://imken.moe" text="Imken" />,{" "}
            <Link to="https://github.com/immccn123/uptime-status/" text="source code" />
          </p>
        </div>
      </div>
    </>
  );
};

export default App;
