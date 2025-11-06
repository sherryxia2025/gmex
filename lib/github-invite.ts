const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_OWNER || "test";
export async function inviteToRepo(username: string, repoName: string) {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${repoName}/collaborators/${username}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        permission: "pull", // pull=read, triage, push, maintain, admin
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`邀请失败: ${err}`);
  }

  // GitHub may return 204 No Content if user is already a collaborator
  // or an empty body for some success cases. Parse safely.
  const raw = await res.text();
  if (!raw) {
    return { success: true, status: res.status } as const;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return { success: true, status: res.status } as const;
  }
}
