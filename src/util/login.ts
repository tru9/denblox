import { request } from "../util/request.ts";
import { AuthenticatedUser } from "./types.d.ts";
import storage from "../util/data.ts";

/**
 * Begins a session with ROBLOX by logging in.
 * @param cookie - _|WARNING:DO-NOT-SHARE-THIS.....
 * @returns Authenticated User
 * @example 
 * ```ts
 * import * as denblox from "https://deno.land/x/denblox/mod.ts";
 * 
 * await denblox.login("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_...");
 * ```
 */

export async function login(cookie: string): Promise<AuthenticatedUser> {
    if (!cookie) throw new Error("Endpoint requires Cookie; Missing Cookie Paramter.");

    const response = await request("https://users.roblox.com/v1/users/authenticated", undefined, {
        headers: {
            "Cookie": `.ROBLOSECURITY=${cookie}`,
            "Content-type": "application/json"
        }
    });

    const body = await response.json();
    if ("errors" in body) throw body.errors[0];

    storage["cookie"] = cookie;
    return body;
};



