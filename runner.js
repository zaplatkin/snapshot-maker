const playwright = require('playwright');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

(async () => {
  const browser = await playwright.chromium.launch();

  // context with custom headers
  var context = await browser.newContext({ userAgent: 'custom user agent' })
  var page = await context.newPage()

  page.setExtraHTTPHeaders({
    'Aalphabetically-first': 'yes',
    'Aalphabetically-second': 'yes'
  })

  page.on('response', resp => {
    console.log(resp.request().headers());
  });

  await page.goto('https://www.whatismybrowser.com/detect/what-http-headers-is-my-browser-sending');
  await page.screenshot({ path: `custom_headers.png` });

  // context with regular headers
  var context = await browser.newContext({ userAgent: 'custom user agent' })
  var page = await context.newPage()

  page.on('response', resp => {
    console.log(resp.request().headers());
  });

  await page.goto('https://www.whatismybrowser.com/detect/what-http-headers-is-my-browser-sending');
  await page.screenshot({ path: `regular_headers.png` });

  await browser.close();

  const custom_headers_img = PNG.sync.read(fs.readFileSync('custom_headers.png'));
  const regular_headers_img = PNG.sync.read(fs.readFileSync('regular_headers.png'));
  const { width, height } = custom_headers_img;
  const diff = new PNG({ width, height });

  pixelmatch(custom_headers_img.data, regular_headers_img.data, diff.data, width, height, { threshold: 0.1 });

  fs.writeFileSync('diff.png', PNG.sync.write(diff));
})()