import { request } from "../util/request.ts";

export async function refreshToken(): Promise<string | null> {
    const response = await request("https://auth.roblox.com/v2/logout", "CookieReq", {
        method: "POST"
    });

    const body = await response.json();
    if ("errors" in body && !body["errors"][0].message.includes("Token Validation")) throw body["errors"][0];

    const csrf = response.headers.get("x-csrf-token");
    return csrf;
};