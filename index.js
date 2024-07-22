require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const OpenAI = require('openai').OpenAI;
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use the API key from the environment variable
});

let CONTENT = '';

async function main() {
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'give me a wise stoic quote, put the quote in quotation marks and also separate the quote from the the part who said it by one line' }],
    stream: true,
  });
  for await (const chunk of stream) {
    CONTENT += chunk.choices[0]?.delta?.content || '';
  }
}

(async () => {
  await main();
  console.log(CONTENT);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.threads.net/login/', { waitUntil: 'networkidle2' });

  console.log(CONTENT);
  
  let selector = '.x6ikm8r.x10wlt62.xlyipyv';

  try {
    await page.waitForSelector(selector, { timeout: 60000 });

    await page.evaluate(async (selector) => {
      let elements = document.querySelectorAll(selector);

      if (elements.length > 5) {
        elements[5].click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        let nextElement = document.getElementsByClassName('x6s0dn4 x78zum5 x1qughib x10b6aqq xh8yej3')[0];
        if (nextElement) {
          nextElement.click();
        } else {
          console.log('The login button element was not found.');
        }
      } else {
        console.log('The sixth element was not found.');
      }
    }, selector);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const usernameSelector = '.x1i10hfl.x9f619.xggy1nq.x1s07b3s.x1kdt53j.x1a2a7pz.x90nhty.x1v8p93f.xogb00i.x16stqrj.x1ftr3km.xyi19xy.x1ccrb07.xtf3nb5.x1pc53ja.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x178xt8z.xm81vs4.xso031l.xy80clv.xp07o12.xjohtrz.x1a6qonq.xyamay9.x1pi30zi.x1l90r2v.x1swvt13.x1yc453h.xh8yej3.x1e899rk.x1sbm3cl.x1rpcs5s.x1c5lum3.xd5rq6m';
    await page.waitForSelector(usernameSelector, { timeout: 60000 });
    const usernameElement = (await page.$$(usernameSelector))[0];
    await usernameElement.type(process.env.THREADS_USERNAME); // Use the username from the environment variable

    await new Promise(resolve => setTimeout(resolve, 2000));

    const passwordSelector = '.x1i10hfl.x9f619.xggy1nq.x1s07b3s.x1kdt53j.x1a2a7pz.x90nhty.x1v8p93f.xogb00i.x16stqrj.x1ftr3km.xyi19xy.x1ccrb07.xtf3nb5.x1pc53ja.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x178xt8z.xm81vs4.xso031l.xy80clv.xp07o12.xjohtrz.x1a6qonq.xyamay9.x1pi30zi.x1l90r2v.x1swvt13.x1yc453h.xh8yej3.x1e899rk.x1sbm3cl.x1rpcs5s.x1c5lum3.xd5rq6m';
    await page.waitForSelector(passwordSelector, { timeout: 60000 });
    const passwordElement = (await page.$$(passwordSelector))[1];
    await passwordElement.type(process.env.THREADS_PASSWORD); // Use the password from the environment variable

    await new Promise(resolve => setTimeout(resolve, 2000));

    const nextElementSelector = '.xzii09s.xyi19xy.x1ccrb07.xtf3nb5.x1pc53ja.x5yr21d.x10l6tqk.xh8yej3.x1ja2u2z';
    await page.waitForSelector(nextElementSelector, { timeout: 60000 });
    const nextElement = (await page.$$(nextElementSelector))[0];
    await nextElement.click();

    await new Promise(resolve => setTimeout(resolve, 5000));

    if (page.url() == 'https://www.threads.net/') {
      for (let i = 0; i < 12; i++) {
        await page.keyboard.press('Tab');
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } else {
      console.log('The page could not be loaded');
    }
    await page.keyboard.press('Enter');

    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.keyboard.type(CONTENT);

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Press CTRL + ENTER
    await page.keyboard.down('Control');
    await page.keyboard.press('Enter');
    await page.keyboard.up('Control');

    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
