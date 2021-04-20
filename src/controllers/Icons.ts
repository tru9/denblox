import { request } from "../util/request.ts";
import { Value } from "../typings/util.d.ts";

export interface Icon {
  data: {
    state: string;
    targetId: number;
    imageUrl: string;
  }[];
}/**
 *  Sends a request to `Thumbnails` endpoint, getting multiple avatars images given user Id(s).
 * @category `Thumbnails`
 * @alias `getUserAvatars`
 * @param {Value<string | number>} userIds - A viable Array of User IDs or one User ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const avatar = await denblox.getUserAvatars(0)
// OR
   const avatar = await denblox.getUserAvatars([1, 2, 3]);
   console.log(avatar)
 */

export async function getUserAvatars(userIds: Value<string | number>, init?: {
  size?:
    | "30x30"
    | "48x48"
    | "60x60"
    | "75x75"
    | "100x100"
    | "110x100"
    | "140x140"
    | "150x150"
    | "180x180"
    | "250x250"
    | "352x352"
    | "420x420"
    | "720x720";
  format?: "Png" | "Jpeg";
  isCircular?: true | false;
}): Promise<Icon> {
  if (isNaN(Number(userIds))) {
    throw new Error("An invalid value in userIds was provided.");
  }
  const id = (Array.isArray(userIds)) ? userIds.join("%2C") : userIds;
  const url =
    `https://thumbnails.roblox.com/v1/users/avatar?userIds=${id}&size=${init
      ?.size || "30x30"}&format=${init?.format ||
      "Png"}&isCircular=${init?.isCircular || false}`;

  const body = await (await request(url)).json();
  if ("errors" in body) {
    throw (body.errors.length <= 1) ? body.errors[0] : body.errors.join(", ");
  }
  return body;
}

/**
 *  Sends a request to `Thumbnails` endpoint, getting multiple headshot images given user Id(s).
 * @category `Thumbnails`
 * @alias `getUserHeadShots`
 * @param {Value<string | number>} userIds - A viable Array of User IDs or one User ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const avatar = await denblox.getUserHeadShots(0)
// OR
   const avatar = await denblox.getUserHeadShots([1, 2, 3]);
   console.log(avatar)
 */

export async function getUserHeadShots(userIds: Value<number | string>, init?: {
  size?:
    | "48x48"
    | "50x50"
    | "60x60"
    | "75x75"
    | "100x100"
    | "110x100"
    | "150x150"
    | "180x180"
    | "352x352"
    | "420x420"
    | "720x720";
  format?: "Png" | "Jpeg";
  isCircular?: true | false;
}): Promise<Icon> {
  if (isNaN(Number(userIds))) {
    throw new Error("An invalid value in userIds was provided.");
  }
  const id = (Array.isArray(userIds)) ? userIds.join("%2C") : userIds;
  const url =
    `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=${init
      ?.size || "48x48"}&format=${init?.format ||
      "Png"}&isCircular=${init?.isCircular || false}`;

  const body = await (await request(url)).json();
  if ("errors" in body) {
    throw (body.errors.length <= 1) ? body.errors[0] : body.errors.join(", ");
  }

  return body;
}/**
 *  Sends a request to `Thumbnails` endpoint, getting multiple place icons given places Id(s).
 * @category `Thumbnails`
 * @alias `getPlaceIcon`
 * @param {Value<string | number>} placeIds - Multiple IDs or One.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const place = await denblox.getPlaceIcon(0)
// OR
   const place = await denblox.getPlaceIcon([1, 2, 3]);
   console.log(place)
 */

export async function getPlaceIcon(placeIds: Value<string | number>, init?: {
  size?: "50x50" | "128x128" | "150x150" | "256x256" | "512x512";
  format?: "Png" | "Jpeg";
  isCircular?: true | false;
}): Promise<Icon> {
  if (isNaN(Number(placeIds))) {
    throw new Error("An invalid value in placeIds was provided.");
  }
  const id = (Array.isArray(placeIds)) ? placeIds.join("%2C") : placeIds;

  const url =
    `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${id}&size=${init
      ?.size || "50x50"}&format=${init?.format ||
      "Png"}&isCircular=${init?.isCircular || false}`;
  const body = await (await request(url)).json();
  if ("errors" in body) {
    throw (body.errors.length <= 1) ? body.errors[0] : body.errors.join(", ");
  }

  return body;
}

/**
 *  Sends a request to `Thumbnails` endpoint, getting multiple badge icons given badge Id(s).
 * @category `Thumbnails`
 * @alias `getBadgeIcon`
 * @param {Value<string | number>} badgeIds - Multiple IDs or One.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const badge = await denblox.getBadgeIcon(0)
// OR
   const badge = await denblox.getBadgeIcon([1, 2, 3]);
   console.log(badge)
 */

export async function getBadgeIcon(badgeIds: Value<string | number>, init?: {
  format?: "Png" | "Jpeg";
  isCircular?: true | false;
}): Promise<Icon> {
  if (isNaN(Number(badgeIds))) {
    throw new Error("An invalid value in placeIds was provided.");
  }
  const id = (Array.isArray(badgeIds)) ? badgeIds.join("%2C") : badgeIds;

  const url =
    `https://thumbnails.roblox.com/v1/badges/icons?badgeIds=${id}&size=150x150&format=${init
      ?.format || "Png"}&isCircular=${init?.isCircular || "false"}`;
  const body = await (await request(url)).json();
  if ("errors" in body) {
    throw (body.errors.length <= 1) ? body.errors[0] : body.errors.join(", ");
  }

  return body;
}

/**
 *  Sends a request to `Thumbnails` endpoint, getting multiple gamepasses icons given gamepasses Id(s).
 * @category `Thumbnails`
 * @alias `getGamepassIcons`
 * @param {Value<string | number>} gamepassIds - Multiple IDs or One.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const gamepass = await denblox.getGamepassIcons(0)
// OR
   const gamepass = await denblox.getGamepassIcons([1, 2, 3]);
   console.log(gamepass)
 */

export async function getGamepassIcons(
  gamepassIds: Value<string | number>,
  init?: {
    format?: "Png" | "Jpeg";
    isCircular?: true | false;
  },
): Promise<Icon> {
  if (isNaN(Number(gamepassIds))) {
    throw new Error("An invalid value in placeIds was provided.");
  }
  const id = (Array.isArray(gamepassIds))
    ? gamepassIds.join("%2C")
    : gamepassIds;

  const url =
    `https://thumbnails.roblox.com/v1/game-passes?gamePassIds=${id}&size=150x150&format=${init
      ?.format || "Png"}&isCircular=${init?.isCircular || "false"}`;
  const body = await (await request(url)).json();
  if ("errors" in body) {
    throw (body.errors.length <= 1) ? body.errors[0] : body.errors.join(", ");
  }

  return body;
}
