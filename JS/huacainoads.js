let headers = $request.headers || {};
let op =
  headers["Operation-Type"] ||
  headers["operation-type"] ||
  headers["Operation-type"] ||
  "";

if (op === "appSplshScrnPgQryAndQryAgrmtYS") {
  console.log("命中华夏信用卡开屏接口: " + op);

  // 加密响应无法正常改 JSON，先尝试返回空 body。
  // 如果 App 只是忽略失败，开屏会消失；
  // 如果 App 严格校验，可能会影响启动，需要撤回。
  $done({
    body: ""
  });
} else {
  $done({});
}
