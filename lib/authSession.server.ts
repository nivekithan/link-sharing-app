import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { Config } from "sst/node/config";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export const authSessionStorage = createCookieSessionStorage<{
  userId: string;
}>({
  cookie: {
    name: "auth_session",
    sameSite: "lax",
    httpOnly: true,
    maxAge: ONE_YEAR_IN_SECONDS,
    secure: true,
    secrets: [Config.COOKIE_SECRET],
  },
});

export async function requireUser(request: Request) {
  const userId = await getUserFromRequest(request);

  if (userId === null) {
    return redirect("/login");
  }

  return userId;
}

export async function requireAnon(request: Request) {
  const userId = await getUserFromRequest(request);

  if (userId !== null) {
    return redirect("/");
  }
}

async function getUserFromRequest(request: Request) {
  const authSession = await authSessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  const userId = authSession.get("userId");

  if (userId === undefined) {
    return null;
  }

  return userId;
}
