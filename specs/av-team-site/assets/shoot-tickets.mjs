// Capture review shots for submit form (slice 05) and tracker (slice 06).
import { chromium } from "playwright";

const base = "http://localhost:3000";
const outDir = new URL(".", import.meta.url).pathname;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(`${base}/submit`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}05-form-empty.png`, fullPage: true });

// Trigger client validation errors
await page.click('button[type="submit"]');
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}05-form-errors.png`, fullPage: true });

await page.goto(`${base}/tracker`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}06-tracker.png`, fullPage: true });

await browser.close();
console.log("shots written");
