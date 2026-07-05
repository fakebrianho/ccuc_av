// Capture review shots for team (slice 02) and responsibilities (slice 03).
import { chromium } from "playwright";

const base = "http://localhost:3000";
const outDir = new URL(".", import.meta.url).pathname;

const browser = await chromium.launch();

for (const [name, width, height] of [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${base}/team`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${outDir}02-team-${name}.png`, fullPage: true });

  await page.goto(`${base}/responsibilities`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: `${outDir}03-responsibilities-${name}.png`,
    fullPage: true,
  });
  await page.close();
}

await browser.close();
console.log("shots written");
