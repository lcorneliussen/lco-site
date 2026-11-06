const X_API = "https://api.x.com/2";
const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

type XUserResponse = {
  data?: { id?: string };
};

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

  const userResponse = await fetch(`${X_API}/users/by/username/lcorneliussen`, {
    headers,
  });

  if (!userResponse.ok) {
    throw new Error(`X user lookup failed with HTTP ${userResponse.status}`);
  }

  const user = (await userResponse.json()) as XUserResponse;
  const userId = user.data?.id;
  if (!userId) return null;

  const postsResponse = await fetch(
    `${X_API}/users/${userId}/tweets?max_results=5&tweet.fields=created_at`,
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
