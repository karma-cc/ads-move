/*
华夏信用卡 - 开屏广告排查版
重点接口：
- appSplshScrnPgQryAndQryAgrmtYS
- qryPageAppHD
- alipay.client.getUnionResource
*/

const headers = $request.headers || {};
let op = "";

for (let k in headers) {
  if (k.toLowerCase() === "operation-type") {
    op = String(headers[k] || "");
    break;
  }
}

console.log("HXB mgw hit, Operation-Type = " + op);

const blockOps = [
  "appSplshScrnPgQryAndQryAgrmtYS",
  "qryPageAppHD",
  "alipay.client.getUnionResource"
];

if (blockOps.includes(op)) {
  console.log("HXB block op: " + op);

  // 不直接断网，返回空成功体测试
  // 由于原响应是加密 text/plain，无法正常 JSON 改字段
  $done({
    status: "HTTP/1.1 200 OK",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      "Content-Length": "0",
      "Connection": "keep-alive"
    },
    body: ""
  });
} else {
  $done({});
}
