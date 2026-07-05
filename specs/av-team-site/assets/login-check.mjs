// Verify slice 07: wrong password rejected, right password reaches /admin, logout re-guards.
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto("http://localhost:3000/admin");
await page.waitForURL("**/login");
console.log("unauth /admin -> redirected to /login: OK");

await page.fill('input[type="password"]', "wrongpass");
await page.click('button[type="submit"]');
await page.waitForTimeout(1500);
const err = await page.textContent("body");
console.log("wrong password rejected:", err.includes("Incorrect password") ? "OK" : "FAIL");

await page.fill('input[type="password"]', "testpass");
await page.click('button[type="submit"]');
await page.waitForURL("**/admin", { timeout: 10000 });
console.log("correct password -> /admin: OK");

await page.click('button:has-text("Log out")');
await page.waitForURL("**/login", { timeout: 10000 });
await page.goto("http://localhost:3000/admin");
await page.waitForURL("**/login");
console.log("logout re-guards /admin: OK");

await browser.close();
