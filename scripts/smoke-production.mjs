import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: [
    "--no-sandbox",
    "--enable-unsafe-swiftshader",
    "--use-gl=angle",
    "--use-angle=swiftshader",
  ],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto("http://127.0.0.1:4173");
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.locator(".performance")).toContainText("fps", {
    timeout: 30000,
  });
  await page.getByRole("tab", { name: "Thermal" }).click();
  await expect(page.locator(".mode-note")).toContainText("Amber");
  await page.getByLabel("Search components").fill("processor");
  await page
    .getByRole("button", {
      name: "Intel processor / integrated GPU",
      exact: true,
    })
    .click();
  await expect(page.locator(".inspector h2")).toContainText("Intel");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "test-results/production.png" });
  expect(errors).toEqual([]);
  console.log(
    "Production application rendered, loaded internal assembly, selected processor and displayed thermal notes without JavaScript errors.",
  );
} finally {
  await browser.close();
}
