import { request } from "../util/request.ts";
import session from "./storage.ts";

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

interface AuthenticatedUser {
  displayName: string;
  username: string;
  id: number;
}
