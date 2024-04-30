import { Tooltip as ReactTooltip } from "react-tooltip";
import { getMonitors } from "../common/uptimerobot";
import { formatDuration, formatNumber } from "../common/helper";
import Link from "./link";
import useSWR from "swr";

function UptimeRobot({ apikey, callback }) {
  const status = {
    ok: "可用",
    down: "中断",
    unknow: "未知",
  };

  const { CountDays, ShowLink } = window.Config;

  const { data, isValidating } = useSWR(
    { apikey, days: CountDays },
    getMonitors,
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
      onSuccess: (data) => {
        callback(data);
      },
    }
  );

  if (data)
    return data.map((site) => (
      <div key={site.id} className="site">
        <div className="meta">
          <span
            className="name"
            dangerouslySetInnerHTML={{ __html: site.name }}
          />
          {ShowLink && <Link className="link" to={site.url} text={site.name} />}
          <span className={"status " + site.status}>
            {isValidating ? <span className="refreshing"></span> : <></>}
            <i className={"expander " + site.status} /> {status[site.status]}
          </span>
        </div>
        <div className="timeline">
          {site.daily.map((data, index) => {
            let status = "";
            let text = data.date.format("YYYY-MM-DD ");
            if (data.uptime >= 100) {
              status = "ok";
              text += `可用率 ${formatNumber(data.uptime)}%`;
            } else if (data.uptime <= 0 && data.down.times === 0) {
              status = "none";
              text += "无数据";
            } else if (data.uptime >= 98) {
              status = "partial-high";
              text += `可用率 ${formatNumber(data.uptime)}%`;
            } else if (data.uptime >= 95 && data.uptime <= 98) {
              status = "mid";
              text += `可用率 ${formatNumber(data.uptime)}%`;
            } else {
              status = "down";
              text += `可用率 ${formatNumber(data.uptime)}%`;
            }
            return (
              <i
                key={index}
                className={status}
                data-tooltip-content={text}
                data-tooltip-id="tooltip"
                data-tooltip-variant="dark"
              />
            );
          })}
        </div>
        <div className="summary">
          <span>{site.daily[0].date.format("YYYY-MM-DD")}</span>
          <span>
            {site.total.times
              ? `近 ${CountDays} 天故障 ${
                  site.total.times
                } 次，累计 ${formatDuration(site.total.duration)}，平均可用率 ${
                  site.average
                }%`
              : `近 ${CountDays} 天可用率 ${site.average}%`}
          </span>
          <span>今天</span>
        </div>
        <ReactTooltip className="tooltip" place="top" id="tooltip" />
      </div>
    ));
  else
    return (
      <div className="site">
        <div className="loading" />
      </div>
    );
}

export default UptimeRobot;
