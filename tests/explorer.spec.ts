import { test, expect } from "@playwright/test";
test("desktop explorer controls, evidence, and modes", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Inside the machine." }),
  ).toBeVisible();
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.locator(".performance")).toContainText("fps", {
    timeout: 30000,
  });
  await page.screenshot({ path: "test-results/desktop-closed.png" });
  const initialCamera = await page
    .locator("canvas")
    .getAttribute("data-camera");
  const canvas = page.locator("canvas");
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.56, {
    steps: 15,
  });
  await page.mouse.up();
  await expect(canvas).not.toHaveAttribute("data-camera", initialCamera!);
  const orbitCamera = await canvas.getAttribute("data-camera");
  await page.mouse.wheel(0, -180);
  await expect(canvas).not.toHaveAttribute("data-camera", orbitCamera!);
  await page.waitForTimeout(2500);
  const settledCamera = await canvas.getAttribute("data-camera");
  await page.waitForTimeout(1800);
  expect(await canvas.getAttribute("data-camera")).toBe(settledCamera);
  await page.getByLabel("Lid angle", { exact: true }).fill("105");
  await page.getByLabel("X-ray", { exact: true }).fill("0.92");
  await expect(canvas).toHaveAttribute("data-upper-transparent", "true");
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-upper-opacity")))
    .toBeLessThan(0.2);
  await page.getByRole("button", { name: "Logic board", exact: true }).click();
  await expect(page.locator(".inspector h2")).toHaveText("Logic board");
  await page.getByRole("button", { name: "Isolate", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Unisolate", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Restore all components", exact: true })
    .click();
  await page.getByLabel("Explode", { exact: true }).fill("0.45");
  await page.getByLabel("Cross section", { exact: true }).fill("0.2");
  await page.getByLabel("Cross section", { exact: true }).fill("0");
  await page.getByLabel("Search components").fill("processor");
  await page
    .getByRole("button", {
      name: "Intel processor / integrated GPU",
      exact: true,
    })
    .click();
  await expect(page.locator(".inspector h2")).toContainText("Intel processor");
  await page.getByRole("button", { name: "Engineer", exact: true }).click();
  await expect(page.locator(".description")).toContainText("instructions");
  await page.getByRole("button", { name: "Evidence & geometry" }).click();
  await expect(page.locator(".inspector")).toContainText("Tier 3");
  await page.getByLabel("Search components").fill("");
  for (const mode of ["Thermal", "Power", "Data", "Disassembly"]) {
    await page.getByRole("tab", { name: mode }).click();
    await expect(page.getByRole("tab", { name: mode })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.locator(".mode-note")).toBeVisible();
  }
  await page.getByRole("button", { name: "Hide & continue" }).click();
  await expect(page.locator(".disassembly strong")).toContainText("2.");
  await page.getByRole("tab", { name: "Thermal" }).click();
  await page.getByLabel("Explode", { exact: true }).fill("0.3");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "test-results/desktop-thermal.png" });
  await info.attach("renderer metrics", {
    body: await page.locator(".performance").innerText(),
    contentType: "text/plain",
  });
  await page.getByRole("button", { name: "Reset camera and model" }).click();
  await expect(page.getByLabel("Lid angle", { exact: true })).toHaveValue("0");
  await page.waitForTimeout(700);
  const center = (await canvas.boundingBox())!;
  await page.mouse.click(
    center.x + center.width * 0.5,
    center.y + center.height * 0.52,
  );
  await expect(page.locator(".inspector h2")).toHaveText("Display enclosure");
  expect(errors).toEqual([]);
});
test("mobile component navigation and information panel", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("canvas")).toBeVisible();
  await page.getByRole("button", { name: "Components", exact: true }).click();
  await page.getByLabel("Search components").fill("fan");
  await page.getByRole("button", { name: "Left fan", exact: true }).click();
  await expect(page.locator(".inspector h2")).toHaveText("Left fan");
  await page.getByLabel("Lid angle", { exact: true }).fill("105");
  await page.getByLabel("X-ray", { exact: true }).fill("0.9");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Isolate", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Unisolate", exact: true }),
  ).toBeVisible();
});

test("individual instanced key and blade inspection plus undo", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");
  await page.getByLabel("Search components").fill("Blade proxy 1");
  await page
    .getByRole("button", { name: "Blade proxy 1", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "Isolate", exact: true }).click();
  await expect(page.locator(".inspector h2")).toHaveText("Blade proxy 1");
  await page
    .getByRole("button", { name: "Undo navigation", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Isolate", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Search components").fill("Q key");
  await page
    .getByRole("button", { name: "Q key (layout proxy)", exact: true })
    .click();
  await page.getByRole("button", { name: "Isolate", exact: true }).click();
  await expect(page.locator(".inspector h2")).toHaveText(
    "Q key (layout proxy)",
  );
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Evidence & geometry" }).click();
  await page.getByRole("button", { name: "Export component manifest" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "a2251-component-manifest.json",
  );
});
