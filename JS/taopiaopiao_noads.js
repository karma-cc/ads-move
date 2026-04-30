

let body = $response.body || "";

try {
  let obj = JSON.parse(body);

  if (
    obj.api === "mtop.film.mtopadvertiseapi.queryloadingbanner" ||
    /mtop\.film\.mtopadvertiseapi\.queryloadingbanner/.test($request.url)
  ) {
    obj.data = obj.data || {};
    obj.data.returnCode = "0";
    obj.data.returnValue = {};
  }

  body = JSON.stringify(obj);
} catch (e) {}

$done({ body });
