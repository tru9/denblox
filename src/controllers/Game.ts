import * as Types from "../typings/Game.d.ts";
import { request } from "../util/request.ts";

/**
 *  Sends a request to `Places` endpoint, getting place details.
 * @category `Game`
 * @alias `getPlaceData`
 * @param {string | number} placeId - A viable Place ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const place = await denblox.getPlaceData(000000);
   console.log(place);
 */

export async function getPlaceData(
  placeId: string | number,
): Promise<Types.Place> {
  if (isNaN(Number(placeId))) {
    throw new Error("An invalid Place ID was provided.");
  }

  const response = await request(
    `https://www.roblox.com/places/api-get-details?assetId=${placeId}`,
  );
  if (response.status !== 200) {
    throw new Error(
      `An invalid place ID was provided or something went wrong with the request: ${response.statusText}`,
    );
  }
  const body = await response.json();

  return {
    id: body.AssetId,
    name: body.Name,
    description: body.Description,
    created: new Date(body.Created),
    updated: new Date(body.Updated),
    favorites: body.FavoritedCount,
    url: body.Url,
    visited: body.VisitedCount,
    maxPlayers: body.MaxPlayers,
    owner: {
      id: body.BuilderId,
      username: body.Builder,
      profileUrl: body.BuilderAbsoluteUrl,
    },
    isPlayable: body.IsPlayable,
    copyingAllowed: body.IsCopyingAllowed,
    genre: body.AssetGenre,
    playing: body.OnlineCount,
    universeId: body.UniverseId,
    rootPlaceId: body.UniverseRootPlaceId,
    upVotes: body.TotalUpVotes,
    downVotes: body.TotalDownVotes,
    price: body.Price,
  };
}

/**
 *  Sends a request to `Games` endpoint, getting gamepasses of a universe.
 * @category `Game`
 * @alias `getUniverseGamepasses`
 * @param {string | number} universeId - A viable Universe ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const gamepasses = await denblox.getUniverseGamepasses(000000);
   console.log(gamepasses);
 */

export async function getUniverseGamepasses(
  universeId: number | string,
  init?: {
    sort?: "Asc" | "Desc";
    limit?: 10 | 25 | 50 | 100;
    cursor?: string;
  },
): Promise<Types.GamepassInterface> {
  if (isNaN(Number(universeId))) {
    throw new Error("An invalid Universe ID was provided.");
  }
  const url =
    `https://games.roblox.com/v1/games/${universeId}/game-passes?sortOrder=${init
      ?.sort}&limit=${init?.limit || 10}${
      init?.cursor ? `&cursor=${init.cursor}` : ""
    }`;
  const body = await (await request(url)).json();
  if ("errors" in body) {
    throw (body.errors.length <= 1) ? body.errors[0] : body.errors.join(", ");
  }

  return body;
}

/**
 *  Sends a request to `Games` endpoint, getting all games made by a group.
 * @category `Game`
 * @alias `getGroupGames`
 * @param {string | number} groupId - A viable Group ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const groupGames = await denblox.getGroupGames(000000);
   console.log(groupGames);
 */

export async function getGroupGames(groupId: number | string, init?: {
  sort?: "Asc" | "Desc";
  limit?: 10 | 25 | 50 | 100;
  filter?: "All" | "Public" | "Private";
  cursor?: string;
}): Promise<Types.GroupGamesInterface> {
  if (isNaN(Number(groupId))) {
    throw new Error("An invalid Group ID was provided.");
  }
  let url =
    `https://games.roblox.com/v2/groups/${groupId}/games?sortOrder=${init
      ?.sort || "Asc"}&limit=${init?.limit || 10}&filter=${init?.filter ||
      "All"}${init?.cursor ? `&cursor=${init.cursor}` : ""}`;
  const body = await (await request(url)).json();
  if ("errors" in body) {
    throw (body.errors.length <= 1) ? body.errors[0] : body.errors.join(", ");
  }

  const out: Types.GameInt[] = [];
  body.data.forEach((element: Types.GameInt) =>
    out.push({
      ...element,
      created: new Date(element.created),
      updated: new Date(element.updated),
    })
  );

  return {
    ...body,
    data: out,
  };
}/**
 *  Sends a request to `Games` endpoint, getting all servers currently running.
 * @category `Game`
 * @alias `getGameServers`
 * @param {string | number} placeId - A viable Place ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const servers = await denblox.getGameServers(000000);
   console.log(servers);
 */

export async function getGameServers(placeId: number | string, init?: {
  sort?: "Asc" | "Desc";
  limit?: 10 | 25 | 50 | 100;
  cursor?: string;
  filter?: "All" | "Public" | "Private";
}): Promise<Types.ServersInterface> {
  if (isNaN(Number(placeId))) {
    throw new Error("An invalid Place ID was provided.");
  }
  let body =
    await (await request(
      `https://games.roblox.com/v1/games/${placeId}/servers/Public?sortOrder=${init
        ?.sort || "Asc"}&limit=${init?.limit || 10}${
        init?.cursor
          ? `&cursor=${init.cursor}`
          : ""
      }`,
    )).json();
  if ("errors" in body) {
    throw (body.errors.length <= 1) ? body.errors[0] : body.errors.join(", ");
  }

  return body;
}/**
 *  Sends a request to `Games` endpoint, getting all games made by a user.
 * @category `Game`
 * @alias `getUserCreations`
 * @param {string | number} userId - A viable User ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const creations = await denblox.getUserCreations(000000);
   console.log(creations);
 */

export async function getUserCreations(userId: number | string, init?: {
  sort?: "Asc" | "Desc";
  limit?: 10 | 25 | 50 | 100;
  cursor?: string;
  filter?: "All" | "Public" | "Private";
}): Promise<Types.GroupGamesInterface> {
  if (isNaN(Number(userId))) {
    throw new Error("An invalid User ID was provided.");
  }
  let body =
    await (await request(
      `https://games.roblox.com/v2/users/${userId}/games?sortOrder=${init
        ?.sort || "Asc"}&limit=${init?.limit || 10}${
        init?.cursor
          ? `&cursor=${init.cursor}`
          : ""
      }`,
    )).json();
  if ("errors" in body) {
    throw (body.errors.length <= 1) ? body.errors[0] : body.errors.join(", ");
  }

  const out: Types.GameInt[] = [];
  body.data.forEach((element: Types.GameInt, index: number) =>
    out.push({
      ...element,
      updated: new Date(body.data[index].created),
      created: new Date(body.data[index].updated),
    })
  );

  return {
    ...body,
    data: out,
  };
}
