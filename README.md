# uptime-status

一个基于 UptimeRobot API 的在线状态面板，这个版本是修改主题过后的。

稍微仿了下原生的样式（

Screenshot:

![](/screenshot.png)

## 构建

```sh
pnpm build
```

## 部署

构建后修改 `dist/config.js`（或者在构建之前修改 `public/config.js`），详见原项目。

然后把 `dist/` 目录下的所有文件上传到一个静态页面托管服务上。

---

跟原项目没啥太大的关系，只是一个 Fork 而已ww

Licensed under MIT.
