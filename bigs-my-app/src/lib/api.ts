const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export function getAccessToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem(ACCESS_KEY)
    : null;
}
export function getRefreshToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem(REFRESH_KEY)
    : null;
}
export function setTokens(access: string, refresh: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);

  window.dispatchEvent(new Event("loginStatusChanged"));
}
export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  window.dispatchEvent(new Event("loginStatusChanged"));
}

export async function rawJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function signin(username: string, password: string) {
  const data = await rawJson<{ accessToken: string; refreshToken: string }>(
    "/auth/signin",
    {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }
  );
  setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function refresh() {
  const token = getRefreshToken();
  if (!token) {
    throw new Error("No refresh token");
  }

  const data = await rawJson<{ accessToken: string; refreshToken: string }>(
    "/auth/refresh",
    { method: "POST", body: JSON.stringify({ refreshToken: token }) }
  );
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

export async function authJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const first = await tryOnce(path, init);
  if (first.ok) {
    return first.json() as Promise<T>;
  }

  if (first.status === 401) {
    try {
      await refresh();
      const second = await tryOnce(path, init);
      if (second.ok) {
        return second.json() as Promise<T>;
      }
    } catch (e: unknown) {
      clearTokens();
      const message = e instanceof Error ? e.message : "Auth failed";
      throw new Error(message);
    }
  }

  const msg = await first.text();
  throw new Error(msg || `HTTP ${first.status}`);
}

async function tryOnce(path: string, init: RequestInit) {
  const access = getAccessToken();
  const url = `${API_BASE}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
    ...(init.headers || {}),
  };

  const response = await fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });

  return response;
}

export async function postJsonNoBody(path: string, body: any): Promise<void> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP ${res.status}`);
  }
}

export type SignupPayload = {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
};

export async function signup(payload: SignupPayload) {
  await postJsonNoBody("/auth/signup", payload);
}
