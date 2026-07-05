// Verify slice 08: triage queue promote -> public tracker, edit, delete.
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const out = new URL(".", import.meta.url).pathname;

// Log in.
await page.goto("http://localhost:3000/login");
await page.fill('input[type="password"]', "testpass");
await page.click('button[type="submit"]');
await page.waitForURL("**/admin");

// Snapshot dashboard with the triage queue.
await page.waitForSelector("table, article");
await page.waitForTimeout(600);
await page.screenshot({ path: `${out}08-admin-dashboard.png` });

// Count public tickets before approval.
const before = await page.evaluate(async () => {
  const r = await fetch("/api/tickets?scope=public");
  return (await r.json()).tickets.length;
});

// Approve the first queued ticket if present.
const approve = page.locator('button:has-text("Approve")').first();
if (await approve.count()) {
  await approve.click();
  await page.waitForTimeout(800);
  const after = await page.evaluate(async () => {
    const r = await fetch("/api/tickets?scope=public");
    return (await r.json()).tickets.length;
  });
  console.log(`approve: public tickets ${before} -> ${after}`, after === before + 1 ? "OK" : "FAIL");
} else {
  console.log("approve: no queued tickets to promote (skipped)");
}

// Edit a priority via the table select.
const select = page.locator("table select").nth(1);
await select.selectOption("urgent");
await page.waitForTimeout(600);
const patched = await page.evaluate(async () => {
  const r = await fetch("/api/tickets");
  return (await r.json()).tickets.some((t) => t.priority === "urgent");
});
console.log("edit priority via PATCH:", patched ? "OK" : "FAIL");

await page.screenshot({ path: `${out}08-admin-after-triage.png` });
await browser.close();
console.log("done");
