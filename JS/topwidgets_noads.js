/*
Top Widgets+ - 首页 VIP / 广告横幅清理

处理接口：
1. /bff/advertisement/query
2. /app/resource/vip/list
3. /app/home
*/

let url = $request.url || "";
let body = $response.body || "";

const killWords = /VIP|vip|会员|开通|专属功能|广告|advertisement|ad|banner|开通VIP|获取更多专属功能/i;

function emptySuccess(data) {
  return {
    ret: 0,
    msg: "success",
    data: data || {}
  };
}

function cleanArray(arr) {
  if (!Array.isArray(arr)) return arr;

  return arr.filter(item => {
    try {
      return !killWords.test(JSON.stringify(item));
    } catch (e) {
      return true;
    }
  });
}

function deepClean(obj) {
  if (Array.isArray(obj)) {
    return obj
      .map(item => deepClean(item))
      .filter(item => {
        try {
          return !killWords.test(JSON.stringify(item));
        } catch (e) {
          return true;
        }
      });
  }

  if (obj && typeof obj === "object") {
    for (let key of Object.keys(obj)) {
      let value = obj[key];

      // 命中明显广告 / VIP 字段名，直接清空
      if (killWords.test(key)) {
        obj[key] = Array.isArray(value) ? [] : null;
        continue;
      }

      // 字符串内容命中，清空
      if (typeof value === "string" && killWords.test(value)) {
        obj[key] = "";
        continue;
      }

      // 递归处理对象和数组
      if (value && typeof value === "object") {
        obj[key] = deepClean(value);
      }
    }
  }

  return obj;
}

try {
  let obj = JSON.parse(body);

  // 1. 首页广告 / 推广查询
  if (/\/bff\/advertisement\/query/.test(url)) {
    obj.ret = 0;
    obj.msg = "success";
    obj.data = {};

    body = JSON.stringify(obj);
  }

  // 2. VIP 资源推广列表
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

  // 3. 首页配置，清理“开通 VIP 获取更多专属功能”横幅
  else if (/\/app\/home\?/.test(url)) {
    obj.ret = 0;
    obj.msg = "success";
    obj.data = obj.data || {};

    // 首页常见数组字段
    obj.data.categories = cleanArray(obj.data.categories);
    obj.data.groups = cleanArray(obj.data.groups);
    obj.data.resources = cleanArray(obj.data.resources);
    obj.data.grids = cleanArray(obj.data.grids);
    obj.data.tags = cleanArray(obj.data.tags);

    // 兜底：递归清理所有包含 VIP / 会员 / 开通 / 专属功能 的内容
    obj.data = deepClean(obj.data);

    body = JSON.stringify(obj);
  }
} catch (e) {
  // 如果响应体为空、压缩未解开、或不是 JSON，返回空成功结构
  if (/\/bff\/advertisement\/query/.test(url)) {
    body = JSON.stringify(emptySuccess({}));
  } else if (/\/app\/resource\/vip\/list/.test(url)) {
    body = JSON.stringify(emptySuccess({
      list: [],
      resources: [],
      vipList: [],
      timestamp: Date.now()
    }));
  } else if (/\/app\/home\?/.test(url)) {
    body = JSON.stringify(emptySuccess({
      categories: [],
      groups: [],
      resources: [],
      grids: [],
      tags: [],
      removals: {
        categories: [],
        groups: [],
        grids: [],
        resources: []
      },
      lastSequenceId: 0
    }));
  }
}

$done({ body });
