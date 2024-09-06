const chromium = require('@sparticuz/chromium')
const puppeteer = require('puppeteer-core')
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36WAIT_UNTIL=load";

let browser: any

export const render = async ({html, pdf = false}: { html: string, pdf: boolean }): Promise<Buffer> => {
  if (!browser) {
    const defaultViewport = {
      width: 800,
      height: 600,
      deviceScaleFactor: 1,
      isMobile: false,
      isLandscape: false,
      hasTouch: false,
    };
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }

  const page = await browser.newPage();
  page.setUserAgent(USER_AGENT);

  await page.setJavaScriptEnabled(false);
  await page.reload();
  await page.setContent(html);

  if (pdf) {
    return await page.pdf({
      format: 'A4',
      printBackground: true,
    });
  } else {
    return await page.screenshot({
      type: 'jpeg',
      quality: 100,
      fullPage: true,
    });
  }

}
