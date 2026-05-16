const blankHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title></title></head><body></body></html>`;

let body = $response.body || "";
const url = $request.url;

if (
  /\/rx-trip-ai\/pages\/(?:mask|history-list)\//.test(url)
) {
  body = blankHtml;
}

if (/\/rx-trip-ai\/pages\/home/.test(url)) {
  try {
    const obj = JSON.parse(body);

    if (obj && obj.data) {
      if (Array.isArray(obj.data.result)) {
        obj.data.result = obj.data.result
          .map(block => {
            if (!block || typeof block !== "object") return block;

            if (block.layout && block.layout.style) {
              delete block.layout.style.backgroundColor;
            }

            if (block.component && block.component.type && /ad|banner|marketing|coupon/i.test(block.component.type)) {
              return null;
            }

            if (block.dataList && Array.isArray(block.dataList)) {
              block.dataList = block.dataList.filter(item => {
                if (!item || typeof item !== "object") return true;
                const text = JSON.stringify(item);
                return !/广告|banner|coupon|marketing|promotion|特惠|热卖|直播|补贴|榜/.test(text);
              });
            }

            return block;
          })
          .filter(Boolean);
      }

      if (obj.data.tabbar && obj.data.tabbar.tabList) {
        obj.data.tabbar.tabList = obj.data.tabbar.tabList.filter(tab => tab && tab.tabId !== "Trip");
      }
    }

    body = JSON.stringify(obj);
  } catch (e) {}
}

$done({ body });
