/* global process, Buffer */
// AC6 check: drive ride create, ride update and vehicle register forms against a mocked backend.
// usage: node forms.mjs <baseUrl> <label> <outDir> [shots]
import { chromium } from "playwright-core";
import fs from "node:fs";

const [baseUrl, label, outDir, shots] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const CHROME =
  process.env.HOME +
  "/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";

const VEH = {
  id: "11111111-1111-4111-8111-111111111111",
  model: "Swift",
  company: "Maruti",
  color: "Red",
  plateNumber: "GJ01AB1234",
  seatCapacity: 4,
};
const RIDE = {
  id: "22222222-2222-4222-8222-222222222222",
  providerId: "u1",
  vehicleId: VEH.id,
  sourceLabel: { lat: 23.03, lng: 72.55 },
  destinationLabel: { lat: 23.05, lng: 72.6 },
  route: [
    { lat: 23.03, lng: 72.55 },
    { lat: 23.05, lng: 72.6 },
  ],
  departureTime: "2027-01-15T04:00:00.000Z",
  totalSeats: 4,
  availableSeats: 2,
  status: "ACTIVE",
  createdAt: "2026-10-01T00:00:00.000Z",
  updatedAt: "2026-10-01T00:00:00.000Z",
};
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

const result = { label, scenarios: {} };

async function newPage(browser, viewport = { width: 1920, height: 1080 }) {
  const ctx = await browser.newContext({
    viewport,
    timezoneId: "Asia/Kolkata",
  });
  const page = await ctx.newPage();
  const log = { requests: [], pageErrors: [], consoleErrors: [] };
  page.on("pageerror", (e) => log.pageErrors.push(String(e.message)));
  page.on("console", (m) => {
    if (m.type() === "error") log.consoleErrors.push(m.text().slice(0, 200));
  });
  await page.route("**/*", async (route) => {
    const req = route.request();
    const url = req.url();
    if (url.includes("tile.openstreetmap.org"))
      return route.fulfill({
        status: 200,
        contentType: "image/png",
        body: PNG,
      });
    if (url.includes("router.project-osrm.org"))
      return route.fulfill({
        json: {
          routes: [
            {
              geometry: {
                coordinates: [
                  [72.55, 23.03],
                  [72.57, 23.04],
                  [72.6, 23.05],
                ],
              },
            },
          ],
        },
      });
    const t = req.resourceType();
    if (t !== "xhr" && t !== "fetch") return route.continue();
    const path = new URL(url).pathname.replace(/^.*?(\/(api|auth)\/)/, "$1");
    const method = req.method();
    let body = null;
    try {
      body = req.postDataJSON();
    } catch {
      body = req.postData();
    }
    log.requests.push({ method, path, body });
    if (path === "/auth/me")
      return route.fulfill({
        json: {
          success: true,
          message: "ok",
          data: { id: "u1", name: "QA", email: "qa@example.com" },
        },
      });
    if (path === "/api/vehicle/vehicles")
      return route.fulfill({
        json: { success: true, message: "ok", data: [VEH] },
      });
    if (path === "/api/vehicle" && method === "POST")
      return route.fulfill({
        status: 201,
        json: {
          success: true,
          message: "Vehicle registered",
          data: { ...body, id: "33333333-3333-4333-8333-333333333333" },
        },
      });
    if (path.startsWith("/api/ride/user"))
      return route.fulfill({
        json: { success: true, message: "ok", data: [RIDE] },
      });
    if (path === "/api/ride" && method === "POST")
      return route.fulfill({
        status: 201,
        json: {
          success: true,
          message: "Ride created",
          data: {
            ...RIDE,
            ...body,
            id: "44444444-4444-4444-8444-444444444444",
          },
        },
      });
    if (path.startsWith("/api/ride/") && method === "PUT")
      return route.fulfill({
        json: {
          success: true,
          message: "Ride updated",
          data: { ...RIDE, ...body },
        },
      });
    return route.fulfill({
      status: 404,
      json: { success: false, message: "unmocked " + path },
    });
  });
  return { ctx, page, log };
}

async function toasts(page) {
  let out = [];
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(400);
    out = await page.$$eval("[data-sonner-toast]", (els) =>
      els.map((e) => `${e.getAttribute("data-type")}: ${e.innerText.trim()}`),
    );
    if (out.length && i >= 3) break;
  }
  return out.sort();
}
const errorsIn = (page, scope) =>
  page.$$eval(`${scope} p.text-red-500`, (els) =>
    els.map((e) => e.innerText.trim()),
  );

async function shot(page, name) {
  if (shots) await page.screenshot({ path: `${outDir}/${name}.png` });
}

async function goHome(page, nav) {
  // the sidebar is hidden below desktop width, so pick the view the way the app remembers it
  const view = { "My Rides": "rides", "My Vehicles": "vehicles" }[nav];
  await page.addInitScript(
    (v) => localStorage.setItem("coride_active_view", v),
    view,
  );
  await page.goto(baseUrl + "/home");
}

const browser = await chromium.launch({ executablePath: CHROME });

// V1: standalone /vehicle/register (no onSuccess prop)
{
  const { ctx, page, log } = await newPage(browser);
  await page.goto(baseUrl + "/vehicle/register");
  await page.getByRole("button", { name: "Register" }).click();
  await page.waitForTimeout(300);
  const emptyErrors = await errorsIn(page, "form");
  await page.getByPlaceholder("Enter your vehicle model").fill("Swift");
  await page.getByPlaceholder("Enter your vehicle company").fill("Maruti");
  await page.getByPlaceholder("Enter your vehicle color").fill("Red");
  await page
    .getByPlaceholder("Enter your vehicle plate number")
    .fill("gj01ab1234");
  await page.getByPlaceholder("Enter your vehicle seat capacity").fill("11");
  await page.getByRole("button", { name: "Register" }).click();
  await page.waitForTimeout(300);
  const badErrors = await errorsIn(page, "form");
  await page
    .getByPlaceholder("Enter your vehicle plate number")
    .fill("GJ01AB1234");
  await page.getByPlaceholder("Enter your vehicle seat capacity").fill("4");
  await page.getByRole("button", { name: "Register" }).click();
  const t = await toasts(page);
  await shot(page, "vehicle-register-standalone-desktop");
  result.scenarios.vehicleStandalone = {
    emptyErrors,
    badErrors,
    toasts: t,
    ...log,
  };
  await ctx.close();
}

// V2: vehicle register inside the My Vehicles sheet
{
  const { ctx, page, log } = await newPage(browser);
  await goHome(page, "My Vehicles");
  await page.getByRole("button", { name: "Add New Vehicle" }).click();
  await page.getByPlaceholder("Enter your vehicle model").fill("City");
  await page.getByPlaceholder("Enter your vehicle company").fill("Honda");
  await page.getByPlaceholder("Enter your vehicle color").fill("White");
  await page
    .getByPlaceholder("Enter your vehicle plate number")
    .fill("MH12CD5678");
  await page.getByPlaceholder("Enter your vehicle seat capacity").fill("5");
  await shot(page, "vehicle-register-sheet-desktop");
  await page.getByRole("button", { name: "Register" }).click();
  const t = await toasts(page);
  const sheetOpen = await page
    .getByPlaceholder("Enter your vehicle model")
    .isVisible()
    .catch(() => false);
  result.scenarios.vehicleSheet = {
    toasts: t,
    sheetOpenAfterSave: sheetOpen,
    ...log,
  };
  await ctx.close();
}

// R1: create ride
for (const vp of [
  { name: "desktop", width: 1920, height: 1080 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile", width: 375, height: 667 },
]) {
  if (vp.name !== "desktop" && !shots) continue;
  const { ctx, page, log } = await newPage(browser, {
    width: vp.width,
    height: vp.height,
  });
  await goHome(page, "My Rides");
  await page.getByRole("button", { name: "Offer a New Ride" }).click();
  const sheet = page.getByRole("dialog");
  const createDisabledBeforeRoute = await sheet
    .getByRole("button", { name: "Create Ride" })
    .isDisabled();
  await sheet.getByRole("combobox").click();
  await page.getByRole("option", { name: "Maruti - Swift" }).click();
  const seats = sheet.locator('input[type="number"]');
  await seats.fill("3");
  await sheet.locator('input[type="datetime-local"]').fill("2027-01-15T09:30");
  await sheet
    .getByRole("button", { name: /select route|route/i })
    .first()
    .click();
  const map = page.locator(".leaflet-container");
  await map.waitFor();
  const box = await map.boundingBox();
  await map.click({
    position: { x: box.width * 0.4, y: Math.min(box.height, 600) * 0.4 },
  });
  await page.waitForTimeout(200);
  await map.click({
    position: { x: box.width * 0.6, y: Math.min(box.height, 600) * 0.6 },
  });
  await page.getByRole("button", { name: "Generate Route" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Save Route" }).click();
  await page.waitForTimeout(300);
  const summary = (
    await sheet.getByText("Route Summary").locator("..").innerText()
  )
    .split("\n")
    .map((s) => s.replace(/[\d.]+,\s*[\d.]+/, "<lat>,<lng>"));
  await shot(page, `ride-create-${vp.name}`);
  // invalid seats first
  await seats.fill("11");
  await sheet.getByRole("button", { name: "Create Ride" }).click();
  await page.waitForTimeout(300);
  const badErrors = await errorsIn(page, '[role="dialog"]');
  await seats.fill("3");
  await sheet.getByRole("button", { name: "Create Ride" }).click();
  const t = await toasts(page);
  const sheetOpen = await page
    .getByRole("button", { name: "Create Ride" })
    .isVisible()
    .catch(() => false);
  const reqs = log.requests.filter((r) => r.method !== "GET");
  for (const r of reqs) {
    if (r.body?.sourceLabel) r.body.sourceLabel = "<clicked point>";
    if (r.body?.destinationLabel) r.body.destinationLabel = "<clicked point>";
  }
  result.scenarios[`rideCreate_${vp.name}`] = {
    createDisabledBeforeRoute,
    summary,
    badErrors,
    toasts: t,
    sheetOpenAfterSave: sheetOpen,
    writes: reqs,
    pageErrors: log.pageErrors,
    consoleErrors: log.consoleErrors,
  };
  await ctx.close();
}

// R2: update ride
{
  const { ctx, page, log } = await newPage(browser);
  await goHome(page, "My Rides");
  await page.getByRole("button", { name: "Update" }).first().click();
  const sheet = page.getByRole("dialog");
  const prefill = {
    departure: await sheet.locator('input[type="datetime-local"]').inputValue(),
    numbers: await sheet
      .locator('input[type="number"]')
      .evaluateAll((els) => els.map((e) => e.value)),
  };
  await sheet.locator('input[type="number"]').last().fill("3");
  await shot(page, "ride-update-desktop");
  await sheet.getByRole("button", { name: "Update Ride" }).click();
  const t = await toasts(page);
  const sheetOpen = await page
    .getByRole("button", { name: "Update Ride" })
    .isVisible()
    .catch(() => false);
  result.scenarios.rideUpdate = {
    prefill,
    toasts: t,
    sheetOpenAfterSave: sheetOpen,
    writes: log.requests.filter((r) => r.method !== "GET"),
    pageErrors: log.pageErrors,
    consoleErrors: log.consoleErrors,
  };
  await ctx.close();
}

await browser.close();
fs.writeFileSync(
  `${outDir}/forms-${label}.json`,
  JSON.stringify(result, null, 2),
);
console.log(JSON.stringify(result, null, 2));
