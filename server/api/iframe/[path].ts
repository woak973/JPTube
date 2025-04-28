import puppeteer from 'puppeteer';

export default defineEventHandler(async (event) => {
  try {
    // リクエストのペイロードを取得
    if (event.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'HTTP method not allowed' }), {
        status: 405, // Method Not Allowed
        headers: { 'Content-Type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
      });
    }
    const body = await readBody(event);
    const videoId = body?.videoId;

    if (!videoId) {
      return new Response(JSON.stringify({ error: 'videoId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return await handler(videoId);
  } catch (e) {
    console.error('Error in proxy handler:', e);
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
    });
  }
});

const handler = async (videoId: string) => {
  // Puppeteerのブラウザを起動
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  // リクエストのインターセプトを有効化
  await page.setRequestInterception(true);

  let interceptedResponse = null;

  page.on('request', async (interceptedRequest) => {
    const url = interceptedRequest.url();
    if (url === 'https://www.youtube-nocookie.com/youtubei/v1/player?prettyPrint=false') {
      console.log('Intercepted request to:', url);
      interceptedRequest.continue();

      // レスポンスを取得
      page.on('response', async (response) => {
        if (response.url() === url) {
          interceptedResponse = await response.text();
        }
      });
    } else {
      interceptedRequest.continue();
    }
  });

  // 指定されたページに移動
  await page.goto(`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`, { waitUntil: 'networkidle0' });

  // ブラウザを閉じる
  await browser.close();

  // インターセプトしたレスポンスを返す
  if (interceptedResponse) {
    return new Response(interceptedResponse, {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
    });
  } else {
    return new Response(JSON.stringify({ error: 'No intercepted response found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin': '*' },
    });
  }
};
