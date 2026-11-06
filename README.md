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

## Optional X timeline

The build checks the latest post date through the X API. It embeds the official
profile timeline only while the newest post is no more than 14 days old. Add the
read-only bearer token through a masked CLI prompt:

```sh
gh secret set X_BEARER_TOKEN --repo lcorneliussen/lco-site
```

Without that repository secret, the X section is omitted. A daily scheduled
Pages build refreshes the status; a failed API call fails the new deployment so
the last known-good site remains online.
