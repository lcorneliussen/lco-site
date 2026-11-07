import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const author = "lcorneliussen";
const statusPath = fileURLToPath(
  new URL("../src/data/contribution-status.json", import.meta.url),
);

const repositories = {
  omarchy: "omacom/omarchy",
  hype: "omacom/hype",
  openclaw: "openclaw/openclaw",
};

const requestHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "lco-site-contribution-sync",
  "X-GitHub-Api-Version": "2022-11-28",
};

if (process.env.GITHUB_TOKEN) {
  requestHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const current = JSON.parse(await readFile(statusPath, "utf8"));
const next = { ...current };

for (const [key, repository] of Object.entries(repositories)) {
  const query = new URLSearchParams({
    q: `repo:${repository} type:pr author:${author}`,
    per_page: "100",
  });
  const response = await fetch(
    `https://api.github.com/search/issues?${query}`,
    {
      headers: requestHeaders,
    },
  );

  if (!response.ok) {
    throw new Error(
      `GitHub returned ${response.status} while checking ${repository}`,
    );
  }

  const searchResult = await response.json();
  const authoredPullRequests = await Promise.all(
    searchResult.items.map(async (item) => {
      const pullResponse = await fetch(item.pull_request.url, {
        headers: requestHeaders,
      });

      if (!pullResponse.ok) {
        throw new Error(
          `GitHub returned ${pullResponse.status} while reading ${item.html_url}`,
        );
      }

      return pullResponse.json();
    }),
  );

  if (authoredPullRequests.length === 0) {
    throw new Error(`No pull requests by ${author} found in ${repository}`);
  }

  const mergedPullRequests = authoredPullRequests.filter(
    (pullRequest) => pullRequest.merged_at,
  );

  // A merged contribution is permanent. Never downgrade it if an old PR falls
  // outside GitHub's result window later.
  if (current[key] === "PR merged" || mergedPullRequests.length > 0) {
    next[key] = "PR merged";
  } else {
    next[key] = "PR submitted";
  }

  console.log(
    `${repository}: ${authoredPullRequests.length} authored, ${mergedPullRequests.length} merged → ${next[key]}`,
  );
}

const serialized = `${JSON.stringify(next, null, 2)}\n`;
const previous = `${JSON.stringify(current, null, 2)}\n`;

if (serialized !== previous) {
  await writeFile(statusPath, serialized);
  console.log("Contribution status updated.");
} else {
  console.log("Contribution status unchanged.");
}
