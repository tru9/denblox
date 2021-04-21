import * as Types from "../typings/Badge.d.ts";
import { Value } from "../typings/util.d.ts";
import { request } from "../util/request.ts";

/**
 * Sends a request to `Badges` endpoint, getting details of a badge.
 * @category `Badge`
 * @alias `getBadge`
 * @param {number} `badgeId` - A viable Badge ID.
 * @example 
 * import * as denblox from "https://deno.land/x/denblox/mod.ts";
 * 
 * const badge = await denblox.getBadge(00000);
 * console.log(badge);
 */

export async function getBadge(badgeId: number | string): Promise<Types.Badge> {
  if (isNaN(Number(badgeId))) {
    throw new Error("An Invalid Badge ID was provided.");
  }
  const body =
    await (await request(`https://badges.roblox.com/v1/badges/${badgeId}`))
      .json();

  if ("errors" in body) throw body["errors"][0];
  return {
    ...body,
    created: new Date(body.created),
    updated: new Date(body.updated),
  };
}/**
 * @description Sends a request to `Badges` endpoint, getting all badge details of a game.
 * @category `Badge`
 * @alias `getUniverseBadges`
 * @param {number | string} `universeId` - A viable Badge ID.
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 * 
 * const gameBadges = denblox.getUniverseBadges(892043755);
 * console.log(gameBadges.data[0]);
 */

export async function getUniverseBadges(universeId: number | string, init?: {
  sort?: "Asc" | "Desc";
  limit?: 10 | 25 | 50 | 100;
  cursor?: string;
}): Promise<Types.BadgeInterface> {
  if (isNaN(Number(universeId))) {
    throw new Error("An invalid Universe ID was provided.");
  }

  let url =
    `https://badges.roblox.com/v1/universes/${universeId}/badges?limit=${init
      ?.limit || 10}&sortOrder=${init?.sort || "Asc"}${init?.cursor || ""}`;
  const body = await (await request(url)).json();
  if ("errors" in body) {
    throw (body.errors.length <= 1) ? body.errors[0] : body.errors.join(", ");
  }

  const out: Types.Badge[] = [];
  body.data.forEach((element: Types.Badge) =>
    out.push({
      ...element,
      created: new Date(element.created),
      updated: new Date(element.updated),
    })
  );

  return {
    nextPageCursor: body.nextPageCursor,
    previousPageCursor: body.previousPageCursor,
    data: out,
  };
}

/**
 *  Sends a request to `Badges` endpoint, getting user's badges awarded date.
 * @category `Badge`
 * @alias `getBadgeAwarded`
 * @param {string | number} `universeId` - A viable Universe ID.
 * @param {string | string[] | number | number[]} `badgeIds` - A list of Badge Ids or a Badge Id
 * @example
 *  import * as denblox from "https://deno.land/x/denblox/mod.ts"
 * 
 *  const userBadgeAwarded = await denblox.getBadgeAwarded(0000000, 000000);
 *  console.log(userBadgeAwarded.data[0]);
 */

export async function getBadgeAwarded(
  userId: number | string,
  badgeIds: Value<string | number>,
): Promise<Types.BadgeAwardedInterface> {
  if (isNaN(Number(userId))) {
    throw new Error("An Invalid User ID was provided.");
  }

  const badgeId = (Array.isArray(badgeIds) && badgeIds.length === 1)
    ? badgeIds.join("%2C")
    : badgeIds;
  const body =
    await (await request(
      `https://badges.roblox.com/v1/users/${userId}/badges/awarded-dates?badgeIds=${badgeId}`,
    )).json();
  if ("errors" in body) {
    throw (body.errors.length <= 1) ? body.errors[0] : body.errors.join(", ");
  }

  const out: Types.BadgeAwarded[] = [];
  body.data.forEach((element: Types.BadgeAwarded) =>
    out.push({ ...element, awardedDate: new Date(element.awardedDate) })
  );

  return { data: out };
}/**
 *  Sends a request to `Badges` endpoint, updating a badge to given name, description, and enabled.
 * @category `Badge`
 * @alias `getBadgeAwarded`
 * @param {string | number} badgeId - A viable Badge ID.
 * 
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 * 
*  const updated = await denblox.updateBadge(00000, {
    name: "You used denblox!",
    description: "Denblox is the best!",
    enabled: true
   });

   console.log(updated.ok)
 */

export async function updateBadge(badgeId: number | string, init: {
  name: string;
  description: string;
  enabled: boolean;
}): Promise<{ ok: boolean }> {
  if (isNaN(Number(badgeId))) throw new Error("An Invalid ID was provided.");
  if (!init.name || typeof init.name !== "string") {
    throw new Error(
      "An invalid value was provided for name or Name is not a string.",
    );
  }
  if (!init.description || typeof init.description !== "string") {
    throw new Error(
      "An invalid value was provided for description or description is not a string.",
    );
  }
  if (!init.enabled || typeof init.enabled !== "boolean") {
    throw new Error(
      "An invalid value was provided for enabled or enabled is not a boolean.",
    );
  }

  const response = await request(
    `https://badges.roblox.com/v1/badges/${badgeId}`,
    "strict",
    { method: "PATCH" },
  );
  const body = await response.json();
  if ("errors" in body) {
    throw (body.errors.length <= 1) ? body.errors[0] : body.errors.join(", ");
  }

  return { ok: response.ok };
}
