

let url = $request.url;
let body = $response.body || "";

try {
  let obj = JSON.parse(body);


  if (/\/V2\/splash\/getSplashV2\.action/.test(url)) {
    obj.status = 0;
    obj.data = {
      adSpaceId: 0,
      adSplashId: 0,
      extAdSpaceId: 0,
      splashInterval: 0
    };
  }


  else if (/\/d\/json\/e\/1\.1/.test(url)) {

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
