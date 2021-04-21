import session from "../util/storage.ts";
import { request } from "../util/request.ts";

interface AuthenticatedUser {
  displayName: string;
  username: string;
  id: number;
}

/**
 *  Sends a request to `Users` endpoint, getting the current authenticated user.
 * @category `Auth`
 * @alias `getAuthenticatedUser`
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const user = await denblox.getAuthenticatedUser();
   console.log(user);
 */

export async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
  const body =
    await (await request(
      "https://users.roblox.com/v1/users/authenticated",
      "normal",
    )).json();
  if ("errors" in body) {
    throw (body.errors.length <= 1) ? body.errors[0] : body.errors.join(", ");
  }
  return body;
}

/**
 *  Sends a request to `Users` endpoint, validating the cookie provided & then storing the cookie.
 * @category `Auth`
 * @alias `login`
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const user = await denblox.login("_|WARNING:-DO-NOT-SHARE-THIS....");
   console.log(user);
 */

export async function login(cookie: string): Promise<AuthenticatedUser> {
  if (
    typeof cookie !== "string" ||
    !cookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS")
  ) {
    throw new Error(
      "An invalid Roblox Cookie was provided. Please be sure to include the _|WARNING:-DO-NOT-SHARE-THIS.... warning as well.",
    );
  }

  const body =
    await (await request(
      "https://users.roblox.com/v1/users/authenticated",
      undefined,
      {
        headers: {
          "Cookie": `.ROBLOSECURITY=${cookie}`,
          "Content-type": "application/json",
        },
      },
    )).json();

  if ("errors" in body) {
    throw (body.errors.length <= 1) ? body.errors[0] : body.errors.join(", ");
  }

  session["cookie"] = cookie;
  return body;
}
