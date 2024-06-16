const { chromium } = require("playwright");

async function saveHackerNewsArticles() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://news.ycombinator.com/newest");
  await page.waitForSelector('.athing');
  const articles = await page.$$eval('.athing', nodes => {
    return nodes.slice(0, 100).map(node => {
      const title = node.querySelector('.title a').innerText;
      const age = node.nextElementSibling.querySelector('.age a').innerText;
      return { title, age };
    });
  });
  let sorted = true;
  for (let i = 1; i < articles.length; i++) {
    const prevAge = articles[i - 1].age;
    const currAge = articles[i].age;
    if (new Date(currAge) > new Date(prevAge)) {
      sorted = false;
      break;
    }
  }

  console.log("Articles sorted from newest to oldest:", sorted);

  await browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();
