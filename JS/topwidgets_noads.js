/*
Top Widgets+ - 首页 VIP / 广告横幅清理
目标：
1. /bff/advertisement/query
2. /app/resource/vip/list
*/

let url = $request.url;
let body = $response.body || "";

function emptySuccess(extraData) {
  return {
    ret: 0,
    msg: "success",
    data: extraData || {}
  };
}

try {
  let obj = JSON.parse(body);

  // 首页广告 / 推广查询
  if (/\/bff\/advertisement\/query/.test(url)) {
    obj.ret = 0;
    obj.msg = "success";
    obj.data = {};

    // 常见广告字段兜底清空
    const keys = [
      "list",
      "advertisements",
      "advertisement",
      "ads",
      "adList",
      "banner",
      "banners",
      "popup",
      "popups",
      "vipBanner",
      "homeBanner",
      "homeVipBanner",
      "floatWindow",
      "floatView"
    ];

    for (const k of keys) {
      if (Object.prototype.hasOwnProperty.call(obj.data, k)) {
        obj.data[k] = Array.isArray(obj.data[k]) ? [] : null;
      }
    }

    body = JSON.stringify(obj);
  }

  // VIP 资源推广列表
  else if (/\/app\/resource\/vip\/list/.test(url)) {
    obj.ret = 0;
    obj.msg = "success";
    obj.data = obj.data || {};
    obj.data.list = [];
    obj.data.resources = [];
    obj.data.vipList = [];
    obj.data.timestamp = obj.data.timestamp || Date.now();

    body = JSON.stringify(obj);
  }
} catch (e) {
  // 如果遇到空 body / 压缩未解开 / 非 JSON，返回一个空成功结构
  if (/\/bff\/advertisement\/query/.test(url)) {
    body = JSON.stringify(emptySuccess({}));
  } else if (/\/app\/resource\/vip\/list/.test(url)) {
    body = JSON.stringify(emptySuccess({
      list: [],
      resources: [],
      vipList: [],
      timestamp: Date.now()
    }));
  }
}

$done({ body });
