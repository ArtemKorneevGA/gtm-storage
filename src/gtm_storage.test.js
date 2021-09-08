const puppeteer = require("puppeteer");

function blockingWait(seconds) {
  //simple blocking technique (wait...)
  var waitTill = new Date(new Date().getTime() + seconds * 1000);
  while (waitTill > new Date()) {}
}

test("End to end main scenario between tabs", async () => {
  const test_url = `file://${__dirname.slice(0, -3)}/public/index.html`;
  const browser = await puppeteer.launch({
    headless: true,
    // headless: false,
    // slowMo: 80,
    // args: ["--window-size=1920,1080"],
  });
  const page1 = await browser.newPage();
  await page1.goto(test_url);

  const page2 = await browser.newPage();
  await page2.goto(test_url);

  await page1.waitForTimeout(500); //was 500

  // Step1
  await page2.click("#plus_one");
  await page1.bringToFront();
  blockingWait(1);
  await page1.click("#update_state");

  const step1_page1 = await page1.$eval("#result", (el) => el.textContent);
  const step1_page2 = await page2.$eval("#result", (el) => el.textContent);
  expect(step1_page1).toBe("1");
  expect(step1_page2).toBe("1");

  // Step2
  await page1.click("#plus_one");
  await page2.bringToFront();
  blockingWait(1);
  await page2.click("#update_state");

  const step2_page1 = await page1.$eval("#result", (el) => el.textContent);
  const step2_page2 = await page2.$eval("#result", (el) => el.textContent);
  expect(step2_page1).toBe("2");
  expect(step2_page2).toBe("2");

  browser.close();
});
