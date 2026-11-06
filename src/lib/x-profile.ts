const X_API = "https://api.x.com/2";
const X_USER_ID = "14855506";
const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

type XPostsResponse = {
  data?: Array<{ created_at?: string }>;
};

export type XProfileStatus = {
  latestPostAt: string;
  isFresh: boolean;
};

export async function getXProfileStatus(): Promise<XProfileStatus | null> {
  const override = process.env.X_LATEST_POST_AT;
  const bearerToken = process.env.X_BEARER_TOKEN;

  if (override) {
    return toStatus(override);
  }

  if (!bearerToken) {
    return null;
  }

  const headers = { Authorization: `Bearer ${bearerToken}` };

  const postsResponse = await fetch(
    `${X_API}/users/${X_USER_ID}/tweets?max_results=5&tweet.fields=created_at`,
    { headers },
  );

  if (!postsResponse.ok) {
    throw new Error(`X posts lookup failed with HTTP ${postsResponse.status}`);
  }

  const posts = (await postsResponse.json()) as XPostsResponse;
  const latestPostAt = posts.data?.[0]?.created_at;
  return latestPostAt ? toStatus(latestPostAt) : null;
}

function toStatus(latestPostAt: string): XProfileStatus | null {
  const timestamp = Date.parse(latestPostAt);
  if (!Number.isFinite(timestamp)) return null;

  return {
    latestPostAt: new Date(timestamp).toISOString(),
    isFresh: Date.now() - timestamp <= TWO_WEEKS_MS,
  };
}
