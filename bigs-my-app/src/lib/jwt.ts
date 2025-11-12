export type JwtPayload = Record<string, unknown>;

function b64urlToBytes(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(b64 + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    const bytes = b64urlToBytes(payload);
    const json = new TextDecoder("utf-8").decode(bytes);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function extractUserFromPayload(payload?: JwtPayload | null): {
  id?: string;
  name?: string;
} {
  if (!payload || typeof payload !== "object") return {};

  const pick = (keys: string[]) =>
    keys.map((k) => payload[k]).find((v) => v !== undefined && v !== null) as
      | string
      | number
      | undefined;

  const idRaw = pick(["sub", "id", "userId", "username", "email", "uid"]);
  const nameRaw = pick([
    "name",
    "userName",
    "username",
    "nickname",
    "preferred_username",
    "given_name",
  ]);

  return {
    id: idRaw !== undefined ? String(idRaw) : undefined,
    name: nameRaw !== undefined ? String(nameRaw) : undefined,
  };
}
