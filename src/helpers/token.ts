import { request } from "../util/request.ts";

export default async function refreshToken(): Promise<string | null> {
  const response = await request(
    "https://auth.roblox.com/v2/logout",
    "normal",
    {
      method: "POST",
    },
  );

  const body = await response.json();
  if (
    "errors" in body && !body["errors"][0].message.includes("Token Validation")
  ) {
    throw body["errors"][0];
  }

  const token = response.headers.get("x-csrf-token");
  if (!token) {
    throw new Error(
      "You are not logged in or something went wrong with the x-csrf-token.",
    );
  }
  return token;
}
