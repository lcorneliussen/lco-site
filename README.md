# lco-site

Personal home for Lars Corneliussen: selected products, long-term work, open-source
contributions, and current interests.

Built with [Astro](https://astro.build/) and deployed to GitHub Pages.

## Development

```sh
npm ci
npm run dev
npm run check
npm run build
```

The production build is served from the custom domain, `https://lcorneliussen.de/`.

## Visual review

The repository includes a deterministic responsive-design review harness. It
builds the site, captures every route at five representative viewport sizes,
records overflow and typography metrics, and writes a local HTML gallery:

```sh
npm run visual:capture
```

To additionally ask the locally installed Claude CLI for a read-only critique
of logo quality, typography, visual hierarchy, spacing, and readability:

```sh
npm run visual:review
```

Results are written to `.visual-review/run-*/` (ignored by Git), including
`report.html`, `metrics.json`, and—when requested—`claude-review.md`.

Useful overrides:

```sh
VISUAL_REVIEW_BROWSER=/usr/bin/google-chrome-stable npm run visual:capture
node scripts/visual-review.mjs review --base-url https://lcorneliussen.de
```

The Claude step is optional and never edits the repository. It is restricted
to reading the generated screenshots and metrics.

## Optional X timeline

The build checks the latest post date through the X API. It embeds the official
profile timeline only while the newest post is no more than 14 days old. Add the
read-only bearer token through a masked CLI prompt:

```sh
gh secret set X_BEARER_TOKEN --repo lcorneliussen/lco-site
```

Without that repository secret, the X section is omitted. Scheduled Pages
builds on Monday and Thursday refresh the status; a failed API call fails the
new deployment so the last known-good site remains online.
