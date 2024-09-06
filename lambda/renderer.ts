const chromium = require('@sparticuz/chromium')
const puppeteer = require('puppeteer-core')
const randomUserAgent = require('random-useragent');

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
  page.setUserAgent(randomUserAgent.getRandom());

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
