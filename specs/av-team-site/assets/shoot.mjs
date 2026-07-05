// Capture review shots of the animated shell (slice 01 evidence).
import { chromium } from "playwright";

const base = "http://localhost:3000";
const outDir = new URL(".", import.meta.url).pathname;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(1800); // let hero intro finish
await page.screenshot({ path: `${outDir}01-hero-load.png` });

await page.mouse.wheel(0, 1400);
await page.waitForTimeout(1600);
await page.screenshot({ path: `${outDir}01-hero-scrolled.png` });

await page.click('a[href="/team"]');
await page.waitForTimeout(1200);
await page.screenshot({ path: `${outDir}01-team-placeholder.png` });

await browser.close();
console.log("shots written to", outDir);
