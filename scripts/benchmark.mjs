import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: [
    "--no-sandbox",
    "--enable-unsafe-swiftshader",
    "--use-gl=angle",
    "--use-angle=swiftshader",
  ],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
await page.goto("http://127.0.0.1:5173");
await page.locator("canvas").waitFor();
await page.getByLabel("Graphics quality").selectOption("Low");
const renderer = await page.locator("canvas").evaluate((el) => {
  const gl = el.getContext("webgl2");
  const ext = gl.getExtension("WEBGL_debug_renderer_info");
  return ext
    ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
    : gl.getParameter(gl.RENDERER);
});
const results = [];
for (const mode of ["Closed exterior", "Open X-ray", "Exploded thermal"]) {
  if (mode !== "Closed exterior") {
    await page.getByLabel("Lid angle", { exact: true }).fill("105");
    await page.getByLabel("X-ray", { exact: true }).fill("0.92");
  }
  if (mode === "Exploded thermal") {
    await page.getByLabel("Explode", { exact: true }).fill("0.4");
    await page.getByRole("tab", { name: "Thermal" }).click();
  }
  await page.waitForTimeout(2200);
  const samples = [];
  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(1600);
    samples.push(await page.locator(".performance").innerText());
  }
  results.push({ mode, samples });
}
const output = {
  recorded: new Date().toISOString(),
  viewport: "1440 x 960",
  quality: "Low",
  renderer,
  environment: "Cloud Chromium software WebGL; not target-hardware performance",
  results,
};
writeFileSync("docs/performance.json", JSON.stringify(output, null, 2) + "\n");
console.log(JSON.stringify(output, null, 2));
await browser.close();
