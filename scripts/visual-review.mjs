#!/usr/bin/env node

import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const mode = args[0] === "review" ? "review" : "capture";

function option(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

const routes = [
  { name: "work", path: "/" },
  { name: "church", path: "/bcc/" },
  { name: "personal", path: "/about/" },
];

const viewports = [
  { name: "desktop-wide", width: 1440, height: 1000 },
  { name: "desktop", width: 1200, height: 900 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "mobile", width: 390, height: 844 },
  { name: "mobile-compact", width: 360, height: 800 },
];

function timestamp() {
  return new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .replace("Z", "");
}

const outputDir = path.resolve(
  root,
  option("--out") ?? `.visual-review/run-${timestamp()}`,
);
await mkdir(outputDir, { recursive: true });

async function exists(candidate) {
  try {
    await access(candidate, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

async function browserExecutable() {
  const candidates = [
    process.env.VISUAL_REVIEW_BROWSER,
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate;
  }

  throw new Error(
    "No Chrome/Chromium executable found. Set VISUAL_REVIEW_BROWSER=/path/to/browser.",
  );
}

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".xml", "application/xml; charset=utf-8"],
]);

async function staticServer() {
  const dist = path.join(root, "dist");
  await access(path.join(dist, "index.html"));

  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(
        new URL(request.url ?? "/", "http://local").pathname,
      );
      const requested = pathname.endsWith("/")
        ? `${pathname}index.html`
        : pathname;
      const candidate = path.resolve(dist, `.${requested}`);
      if (
        !candidate.startsWith(`${dist}${path.sep}`) &&
        candidate !== path.join(dist, "index.html")
      ) {
        response.writeHead(403).end("Forbidden");
        return;
      }

      let file = candidate;
      try {
        if ((await stat(file)).isDirectory())
          file = path.join(file, "index.html");
      } catch {
        file = path.join(dist, "404.html");
      }

      const content = await readFile(file);
      response.writeHead(200, {
        "content-type":
          mimeTypes.get(path.extname(file)) ?? "application/octet-stream",
        "cache-control": "no-store",
      });
      response.end(content);
    } catch (error) {
      response.writeHead(500).end(String(error));
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      ),
  };
}

const suppliedBaseUrl = option("--base-url")?.replace(/\/$/, "");
const local = suppliedBaseUrl ? null : await staticServer();
const baseUrl = suppliedBaseUrl ?? local.baseUrl;
const browser = await chromium.launch({
  executablePath: await browserExecutable(),
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const captures = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
      colorScheme: "light",
    });
    const page = await context.newPage();

    for (const route of routes) {
      const url = `${baseUrl}${route.path}`;
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);

      const metrics = await page.evaluate(() => {
        const root = document.documentElement;
        const body = document.body;
        const rect = (element) => {
          if (!element) return null;
          const box = element.getBoundingClientRect();
          return {
            x: Math.round(box.x * 10) / 10,
            y: Math.round(box.y * 10) / 10,
            width: Math.round(box.width * 10) / 10,
            height: Math.round(box.height * 10) / 10,
          };
        };
        const type = (selector) =>
          [...document.querySelectorAll(selector)].map((element) => {
            const style = getComputedStyle(element);
            return {
              text: element.textContent
                .trim()
                .replace(/\s+/g, " ")
                .slice(0, 160),
              rect: rect(element),
              fontFamily: style.fontFamily,
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              letterSpacing: style.letterSpacing,
              lineHeight: style.lineHeight,
            };
          });

        return {
          title: document.title,
          viewport: { width: innerWidth, height: innerHeight },
          document: {
            clientWidth: root.clientWidth,
            scrollWidth: Math.max(root.scrollWidth, body.scrollWidth),
            clientHeight: root.clientHeight,
            scrollHeight: Math.max(root.scrollHeight, body.scrollHeight),
          },
          overflowX:
            Math.max(root.scrollWidth, body.scrollWidth) > root.clientWidth + 1,
          overflowY:
            Math.max(root.scrollHeight, body.scrollHeight) >
            root.clientHeight + 1,
          header: rect(document.querySelector(".site-header")),
          wordmark: rect(document.querySelector(".wordmark")),
          navigation: [
            ...document.querySelectorAll(".site-nav a, .site-nav button"),
          ].map((element) => ({
            text: element.textContent.trim(),
            rect: rect(element),
          })),
          typography: {
            h1: type("h1"),
            h2: type("h2"),
            h3: type("h3"),
            eyebrow: type(".eyebrow"),
            intro: type(".intro"),
          },
        };
      });

      const basename = `${route.name}--${viewport.name}`;
      const screenshot = path.join(outputDir, `${basename}.png`);
      await page.screenshot({ path: screenshot, fullPage: false });

      let fullPageScreenshot = null;
      if (metrics.overflowY) {
        fullPageScreenshot = path.join(outputDir, `${basename}--full.png`);
        await page.screenshot({ path: fullPageScreenshot, fullPage: true });
      }

      captures.push({
        route: route.name,
        path: route.path,
        viewport,
        screenshot: path.relative(root, screenshot),
        fullPageScreenshot: fullPageScreenshot
          ? path.relative(root, fullPageScreenshot)
          : null,
        metrics,
      });
      process.stdout.write(`captured ${basename}\n`);
    }

    await context.close();
  }
} finally {
  await browser.close();
  await local?.close();
}

await writeFile(
  path.join(outputDir, "metrics.json"),
  `${JSON.stringify(captures, null, 2)}\n`,
);
await writeFile(
  path.join(outputDir, "report.html"),
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Visual review · lco-site</title>
<style>
body{margin:0;padding:2rem;background:#171b19;color:#f4f1e9;font:14px/1.5 system-ui,sans-serif}
h1{font-size:2rem}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.25rem}
figure{margin:0;padding:1rem;border:1px solid #3c4641;border-radius:1rem;background:#222825}
img{display:block;width:100%;height:auto;border-radius:.5rem;background:white}
figcaption{display:flex;justify-content:space-between;gap:1rem;margin-top:.75rem;color:#cbd3cf}
.bad{color:#ff9f92}
</style></head><body>
<h1>lco-site visual review</h1>
<p>${captures.length} route/viewport captures from ${new Date().toISOString()}.</p>
<div class="grid">${captures
    .map(
      (
        capture,
      ) => `<figure><img src="${path.basename(capture.screenshot)}" alt="${capture.route} at ${capture.viewport.name}">
<figcaption><span>${capture.route} · ${capture.viewport.name}<br>${capture.viewport.width}×${capture.viewport.height}</span>
<span class="${capture.metrics.overflowX ? "bad" : ""}">x-overflow: ${capture.metrics.overflowX ? "yes" : "no"}<br>page: ${capture.metrics.document.scrollHeight}px</span></figcaption></figure>`,
    )
    .join("")}</div></body></html>`,
);

const prompt = `You are performing a read-only visual design review of a personal portfolio website.

Read every PNG listed below with the Read tool, plus the metrics JSON. Do not edit files and do not run commands.

Screenshots:
${captures.map((capture) => `- ${capture.screenshot}${capture.fullPageScreenshot ? `\n- ${capture.fullPageScreenshot}` : ""}`).join("\n")}

Metrics:
- ${path.relative(root, path.join(outputDir, "metrics.json"))}

Review rubric:
1. Brand mark/logo distinctiveness, optical balance, legibility at header and favicon scale, and relationship to the wordmark.
2. Typographic hierarchy across eyebrow, h1, h2, h3, body and metadata; flag headings that compete, line-height problems, awkward wraps, and weak size contrast.
3. Vertical rhythm and density; identify areas that are too airy or too compressed, with screenshot-specific evidence.
4. Readability: line lengths, body size, contrast, card scanning, and image/text balance.
5. Navigation consistency and responsive behavior across Work, Church and Personal.
6. Card composition, screenshot crops, visual balance, and whether important content is visible above the fold.
7. Accessibility risks visible in the captures.

Return concise Markdown with:
- Executive assessment (max 8 lines)
- Scores out of 5 for brand, hierarchy, rhythm, readability, responsiveness
- Findings grouped by Critical / High / Medium, each citing screenshot filenames
- A prioritized list of no more than 10 concrete improvements, phrased so a CSS/HTML implementer can act on them
- A short logo direction with 2 viable concepts and one recommended concept

Do not praise generically. Be specific, comparative across viewports, and willing to say when a design choice is not working.`;

await writeFile(path.join(outputDir, "review-prompt.md"), `${prompt}\n`);
try {
  await mkdir(path.join(root, ".visual-review"), { recursive: true });
  await writeFile(
    path.join(root, ".visual-review", "latest.txt"),
    `${path.relative(root, outputDir)}\n`,
  );
} catch (error) {
  if (!["EACCES", "ENOENT", "EROFS"].includes(error?.code)) throw error;
}

if (mode === "review") {
  const claudeArgs = [
    "--print",
    "--no-session-persistence",
    "--restricted",
    "--allowedTools",
    "Read",
    "--permission-mode",
    "dontAsk",
    "--model",
    process.env.VISUAL_REVIEW_MODEL ?? "sonnet",
    "--max-budget-usd",
    process.env.VISUAL_REVIEW_BUDGET ?? "2.00",
  ];

  const review = await new Promise((resolve, reject) => {
    const child = spawn("claude", claudeArgs, {
      cwd: root,
      stdio: ["pipe", "pipe", "inherit"],
    });
    let stdout = "";
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0
        ? resolve(stdout)
        : reject(new Error(`Claude CLI exited with ${code}`)),
    );
    child.stdin.end(prompt);
  });
  await writeFile(
    path.join(outputDir, "claude-review.md"),
    review.trimEnd() + "\n",
  );
  process.stdout.write(
    `Claude review: ${path.relative(root, path.join(outputDir, "claude-review.md"))}\n`,
  );
}

process.stdout.write(
  `Visual report: ${path.relative(root, path.join(outputDir, "report.html"))}\n`,
);
