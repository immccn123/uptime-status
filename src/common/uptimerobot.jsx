/**
 * @typedef {import('dayjs')} dayjs
 */

import axios from "axios";
import dayjs from "dayjs";
import { formatNumber } from "./helper";

const statusTable = {
  2: "ok",
  9: "down",
};

/**
 *
 * @param {{ apikey: string, days: number }} param0
 * @returns
 */
export async function getMonitors({ apikey, days }) {
  /** @type {dayjs.Dayjs[]} */
  const dates = [];
  const today = dayjs(new Date().setHours(0, 0, 0, 0));
  for (let d = 0; d < days; d++) {
    dates.push(today.subtract(d, "day"));
  }

  const ranges = dates.map(
    (date) => `${date.unix()}_${date.add(1, "day").unix()}`
  );
  const start = dates[dates.length - 1].unix();
  const end = dates[0].add(1, "day").unix();
  ranges.push(`${start}_${end}`);

  const postdata = {
    api_key: apikey,
    format: "json",
    logs: 1,
    log_types: "1-2",
    logs_start_date: start,
    logs_end_date: end,
    custom_uptime_ranges: ranges.join("-"),
  };

  const { data: respData } = await axios.post(
    "https://api.uptimerobot.com/v2/getMonitors",
    postdata,
    { timeout: 10000 }
  );

  if (respData.stat !== "ok") throw respData.error;

  return respData.monitors.map(
    (
      /**
       * @type {{
       *   logs: any[],
       *   custom_uptime_ranges: string,
       *   friendly_name: string,
       *   url: string
       * }}
       */ {
        custom_uptime_ranges,
        logs,
        id,
        friendly_name: name,
        url,
        status: monitorStatus,
      }
    ) => {
      const ranges = custom_uptime_ranges.split("-");
      const average = formatNumber(ranges.pop());

      /** @type {Record<string, number>} */
      const map = {};

      /**
       * @type {{
       *   date,
       *   uptime,
       *   down: {
       *     times: number,
       *     duration: number,
       *   }
       * }}
       */
      const daily = [];

      dates.forEach((date, index) => {
        map[date.format("YYYYMMDD")] = index;
        daily[index] = {
          date,
          uptime: formatNumber(ranges[index]),
          down: { times: 0, duration: 0 },
        };
      });

      /**
       * @type {{
       *   times: number,
       *   duration: number,
       * }[]}
       */
      const total = logs.reduce(
        (total, log) => {
          if (log.type === 1) {
            const date = dayjs.unix(log.datetime).format("YYYYMMDD");
            total.duration += log.duration;
            total.times += 1;
            daily[map[date]].down.duration += log.duration;
            daily[map[date]].down.times += 1;
          }
          return total;
        },
        { times: 0, duration: 0 }
      );

      return {
        id,
        name,
        url,
        average,
        daily: daily.reverse(),
        total,
        status: statusTable[monitorStatus] ?? "unknow",
      };
    }
  );
}
