// Slice 09: full click-through of every route; captures final shots and
// fails loudly on console errors or hydration warnings.
import { chromium } from "playwright";

const out = new URL(".", import.meta.url).pathname;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const problems = [];
page.on("console", (msg) => {
  const text = msg.text();
  if (msg.type() === "error" || /hydrat/i.test(text)) {
    problems.push(`[${msg.type()}] ${text}`);
  }
});

const routes = [
  ["/", "09-home"],
  ["/team", "09-team"],
  ["/responsibilities", "09-responsibilities"],
  ["/submit", "09-submit"],
  ["/tracker", "09-tracker"],
  ["/login", "09-login"],
];

await page.goto("http://localhost:3000/");
await page.waitForTimeout(1500);

// Navigate via nav links (exercises the page transition), fall back to goto.
for (const [path, name] of routes) {
  const link = page.locator(`header a[href="${path}"]`);
  if (await link.count()) {
    await link.first().click();
  } else {
    await page.goto(`http://localhost:3000${path}`);
  }
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}${name}.png` });
}

await browser.close();

if (problems.length) {
  console.error("CONSOLE PROBLEMS:\n" + problems.join("\n"));
  process.exit(1);
}
console.log("walkthrough clean: no console errors or hydration warnings");
