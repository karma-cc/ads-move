const blankHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title></title></head><body></body></html>`;

let body = $response.body || "";
const url = $request.url;

if (/\/rx-(?:trip-ai|poi-recommend-list)\/pages\//.test(url)) {
  body = blankHtml;
}

$done({ body });
