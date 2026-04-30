/*
Friday - 开屏广告清理
根据本次抓包：
1. /V2/splash/getSplashV2.action 返回 adSplashId = 83
2. /d/json/e/1.1?pos=83 返回 “倍孜5.0-开机-iOS备用” 广告列表
*/

let url = $request.url;
let body = $response.body || "";

try {
  let obj = JSON.parse(body);

  // 1. App 自有开屏配置接口
  if (/\/V2\/splash\/getSplashV2\.action/.test(url)) {
    obj.status = 0;
    obj.data = {
      adSpaceId: 0,
      adSplashId: 0,
      extAdSpaceId: 0,
      splashInterval: 0
    };
  }

  // 2. 第三方广告列表接口
  else if (/\/d\/json\/e\/1\.1/.test(url)) {
    // 只处理开屏广告位 pos=83，避免误伤其他广告位
    if (/[\?&]?pos=83(?:&|$)/.test($request.body || "") || /pos=83/.test($request.body || "")) {
      obj.ads = [];
    } else if (Array.isArray(obj.ads)) {
      obj.ads = obj.ads.filter(ad => {
        let s = JSON.stringify(ad);
        return !/开机|开屏|splash|adSplash|7706|TA202603090930360269|TA202506161033580038|TA202509021436310105/i.test(s);
      });
    }
  }

  body = JSON.stringify(obj);
} catch (e) {}

$done({ body });
