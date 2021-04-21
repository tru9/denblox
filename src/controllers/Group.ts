import * as Types from "../typings/Group.d.ts";
import { UserGroup } from "../typings/User.d.ts";
import { request } from "../util/request.ts";
import { getUserGroups } from "./User.ts";

/**
*  Sends a request to `Group` endpoint, getting details of a group.
 * @category `Group`
 * @alias `getGroup`
 * @param {string | number} groupId - A viable Group ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const group = await denblox.getGroup("00000")
   console.log(group)
 */

export async function getGroup(groupId: number | string): Promise<Types.Group> {
  if (isNaN(Number(groupId))) {
    throw new Error("An invalid Group ID was provided.");
  }
  const [body, thumbnail, ranks] = await Promise.all([
    request(`https://groups.roblox.com/v1/groups/${groupId}`),
    request(
      `https://thumbnails.roblox.com/v1/groups/icons?groupIds=${groupId}&size=150x150&format=Png&isCircular=true`,
    ),
    request(`https://groups.roblox.com/v1/groups/${groupId}/roles`),
  ]).then(
    async (responses) => [
      ...await Promise.all(responses.map((res) => res.json())),
    ]
  );

  if ("errors" in body) {
    throw (body["errors"].length <= 1)
      ? body["errors"][0]
      : body["errors"].join(", ");
  }
  delete ranks.groupId;

  const out = {
    ...body,
    imageUrl: thumbnail.data[0].imageUrl,
    ...ranks,
  } as Types.Group;
  if (out.shout) {
    out.shout.created = new Date(body.shout.updated);
    out.shout.updated = new Date(body.shout.updated);
  }

  return out;
}

/**
*  Sends a request to `Group` endpoint, returning group audit logs actions.
 * @category `Group`
 * @alias `getGroupLogs`
 * @param {string | number} groupId - A viable Group ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
 * await denblox.login(`_|WARNING:-DO-NOT-SHARE-THIS.....`)
*  const logs = await denblox.getGroupLogs("00000")
   console.log(logs)
 */

export async function getGroupLogs(groupId: number | string, init?: {
  sort?: "Asc" | "Desc";
  limit?: 10 | 25 | 50 | 100;
  userId?: number | string;
  actionType?:
    | "DeletePost"
    | "RemoveMember"
    | "AcceptJoinRequest"
    | "DeclineJoinRequest"
    | "PostStatus"
    | "ChangeRank"
    | "BuyAd"
    | "SendAllyRequest"
    | "CreateEnemy"
    | "AcceptAllyRequest"
    | "DeclineAllyRequest"
    | "DeleteAlly"
    | "DeleteEnemy"
    | "AddGroupPlace"
    | "RemoveGroupPlace"
    | "CreateItems"
    | "ConfigureItems"
    | "SpendGroupFunds"
    | "ChangeOwner"
    | "Delete"
    | "AdjustCurrencyAmounts"
    | "Abandon"
    | "Claim"
    | "Rename"
    | "ChangeDescription"
    | "InviteToClan"
    | "KickFromClan"
    | "CancelClanInvite"
    | "BuyClan"
    | "CreateGroupAsset"
    | "UpdateGroupAsset"
    | "ConfigureGroupAsset"
    | "RevertGroupAsset"
    | "CreateGroupDeveloperProduct"
    | "ConfigureGroupGame"
    | "Lock"
    | "Unlock"
    | "CreateGamePass"
    | "CreateBadge"
    | "ConfigureBadge"
    | "SavePlace"
    | "PublishPlace"
    | "UpdateRolesetRank"
    | "UpdateRolesetData";
  cursor?: string;
}): Promise<Types.GroupLogInterface> {
  if (isNaN(Number(groupId))) {
    throw new Error("An invalid Group Id was provided.");
  }
  const url =
    `https://groups.roblox.com/v1/groups/${groupId}/audit-log?limit=${init
      ?.limit || 10}&sortOrder=${init?.sort || "Asc"}${
      init?.userId ? `&userId=${init.userId}` : ""
    }${init?.actionType ? `&actionType=${init.actionType}` : ""}${
      init?.cursor ? `&cursor=${init.cursor}` : ""
    }`;

  const body = await (await request(url, "strict")).json();
  if ("errors" in body) {
    throw (body["errors"].length <= 1)
      ? body["errors"][0]
      : body["errors"].join(", ");
  }

  const out: Types.GroupLog[] = [];
  body.data.forEach((element: Types.GroupLog, index: number) =>
    out.push({ ...element, created: new Date(body.data[index].created) })
  );

  return { ...body, data: out };
}

/**
*  Sends a request to `Group` endpoint, returning group wall.
 * @category `Group`
 * @alias `getGroupWall`
 * @param {string | number} groupId - A viable Group ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
 * // YOU CAN LOGIN IF WALL IS PRIVATE (OPTIONAL)
 * await denblox.login(`_|WARNING:-DO-NOT-SHARE-THIS.....`)
 * 
*  const walls = await denblox.getGroupWall("00000")
   console.log(walls)
 */

export async function getGroupWall(groupId: number | string, init?: {
  sort?: "Asc" | "Desc";
  limit?: 10 | 25 | 50 | 100;
  cursor?: string;
}): Promise<Types.GroupWallInterface> {
  if (isNaN(Number(groupId))) {
    throw new Error("An invalid Group Id was provided.");
  }
  const url =
    `https://groups.roblox.com/v2/groups/${groupId}/wall/posts?limit=${init
      ?.limit || 10}&sortOrder=${init?.sort || "Asc"}${
      init?.cursor ? `&cursor=${init.cursor}` : ""
    }`;

  const body = await (await request(url, "normal")).json();
  if ("errors" in body) {
    throw (body["errors"].length <= 1)
      ? body["errors"][0]
      : body["errors"].join(", ");
  }

  const out: Types.GroupWall[] = [];
  body.data.forEach((element: Types.GroupWall, index: number) =>
    out.push({
      ...element,
      created: new Date(body.data[index].created),
      updated: new Date(body.data[index].updated),
    })
  );

  return { ...body, data: out };
}/**
*  Sends a request to `Group` endpoint, exiling a user provided.
 * @category `Group`
 * @alias `getJoinRequests`
 * @param {string | number} groupId - A viable Group ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
 * await denblox.login(`_|WARNING:-DO-NOT-SHARE-THIS.....`)
 *
* const data = await denblox.getJoinRequests(00000);
  console.log(data);
 */

export async function getJoinRequests(groupId: number | string, init?: {
  sort?: "Asc" | "Desc";
  limit?: 10 | 20 | 50 | 100;
  cursor?: string;
}): Promise<Types.JoinRequestsInterface> {
  if (!groupId) throw new Error("An invalid Group Id was provided.");
  const url =
    `https://groups.roblox.com/v1/groups/${groupId}/join-requests?sortOrder=${init
      ?.sort || "Asc"}&limit=${init?.limit || 10}${
      init?.cursor ? `&cursor=${init.cursor}` : ""
    }`;

  const body = await (await request(url, "strict")).json();
  if ("errors" in body) {
    throw (body["errors"].length <= 1)
      ? body["errors"][0]
      : body["errors"].join(", ");
  }

  const out: Types.JoinRequests[] = [];
  body.data.forEach((element: Types.JoinRequests, index: number) =>
    out.push({ ...element, created: new Date(body.data[index].created) })
  );
  return { ...body, data: out };
}

/**
*  Sends a request to `Group` endpoint, accepting a group join request.
 * @category `Group`
 * @alias `acceptJoinRequest`
 * @param {string | number} groupId - A viable Group ID.
 * @param {string | number} userId - A viable User ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
 * await denblox.login(`_|WARNING:-DO-NOT-SHARE-THIS.....`)
 *
   denblox.acceptJoinRequest(00000, 000)
   .then(() => {...})
   .catch((e) => console.error(e));
 */
export async function acceptJoinRequest(
  groupId: string | number,
  userId: string | number,
): Promise<void> {
  if (isNaN(Number(groupId)) || isNaN(Number(userId))) {
    throw new Error("An invalid Gxroup Id or User Id was provided.");
  }

  const body =
    await (await request(
      `https://groups.roblox.com/v1/groups/${groupId}/join-requests/users/${userId}`,
      "strict",
      {
        method: "POST",
      },
    )).json();

  if ("errors" in body) {
    throw (body["errors"].length <= 1)
      ? body["errors"][0]
      : body["errors"].join(", ");
  }

  return;
}/**
*  Sends a request to `Group` endpoint, declining a group join request.
 * @category `Group`
 * @alias `declineJoinRequest`
 * @param {string | number} groupId - A viable Group ID.
 * @param {string | number} userId - A viable User ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
 * await denblox.login(`_|WARNING:-DO-NOT-SHARE-THIS.....`)
 *
   denblox.declineJoinRequest(00000, 000)
   .then(() => {...})
   .catch((e) => console.error(e));
 */

export async function declineJoinRequest(
  groupId: string | number,
  userId: string | number,
): Promise<void> {
  if (isNaN(Number(groupId)) || isNaN(Number(userId))) {
    throw new Error("An invalid Group Id or User Id was provided.");
  }

  const body =
    await (await request(
      `https://groups.roblox.com/v1/groups/${groupId}/join-requests/users/${userId}`,
      "strict",
      {
        method: "DELETE",
      },
    )).json();

  if ("errors" in body) {
    throw (body["errors"].length <= 1)
      ? body["errors"][0]
      : body["errors"].join(", ");
  }
  return;
}/**
*  Sends a request to `Group` endpoint, change a specified user's rank in a group.
 * @category `Group`
 * @alias `setRank`
 * @param {string | number} groupId - A viable Group ID.
 * @param {string | number} userId - A viable User ID.
 * @param {string | number} roleId - A viable Group Role ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
 * await denblox.login(`_|WARNING:-DO-NOT-SHARE-THIS.....`)
 *
   denblox.setRank(00000, 00000, 000000)
   .then(() => {...})
   .catch((e) => console.error(e));
 */

export async function setRank(
  groupId: number | string,
  userId: number | string,
  roleId: number | string,
): Promise<void> {
  if (
    isNaN(Number(groupId)) || isNaN(Number(userId)) || isNaN(Number(roleId))
  ) {
    throw new Error("An invalid Group Id, User Id, or Role Id was provided.");
  }

  const body =
    await (await request(
      `https://groups.roblox.com/v1/groups/${groupId}/users/${userId}`,
      "strict",
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          "roleId": roleId,
        }),
      },
    )).json();

  if ("errors" in body) {
    throw (body["errors"].length <= 1)
      ? body["errors"][0]
      : body["errors"].join(", ");
  }
  return;
}

/**
*  Sends a request to `Group` endpoint, looks for a user in provided group.
 * @category `Group`
 * @alias `getUserInGroup`
 * @param {string | number} groupId - A viable Group ID.
 * @param {string | number} userId - A viable User ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
 * const user = await denblox.getUserInGroup(00000, 00000)
 * console.log(user);
 */

export async function getUserInGroup(
  groupId: number | string,
  userId: number | string,
): Promise<UserGroup> {
  if (isNaN(Number(groupId)) || isNaN(Number(userId))) {
    throw new Error("An invalid User ID or Group ID was provided.");
  }
  const { data } = await getUserGroups(userId);
  const info = data.find((element) => element.group.id == groupId);
  if (!info) throw new Error("User not in Group");
  return info;
}

/**
*  Sends a request to `Group` endpoint, promoting a user by one.
 * @category `Group`
 * @alias `promote`
 * @param {string | number} groupId - A viable Group ID.
 * @param {string | number} userId - A viable User ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
    denblox.promote(00000, 00000)
   .then(() => {...})
   .catch((e) => console.error(e));
 */

export async function promote(
  groupId: number | string,
  userId: number | string,
): Promise<void> {
  if (isNaN(Number(groupId)) || isNaN(Number(userId))) {
    throw new Error("An invalid User ID or Group ID was provided.");
  }

  try {
    const user = await getUserInGroup(groupId, userId);
    const { roles } = await getGroup(groupId);

    let groupRoles = roles.map((arg) => arg.id);
    let newRole = roles[groupRoles.indexOf(user.role.id) + 1];
    if (
      newRole.id ===
        roles[groupRoles.indexOf(groupRoles[groupRoles.length - 1])].id
    ) {
      throw new Error(`Cannot promote user higher than ${user.role.name}`);
    }

    await setRank(groupId, userId, newRole.id);
  } catch (error) {
    throw new Error(error);
  }

  return;
}/**
*  Sends a request to `Group` endpoint, demoting a user by one.
 * @category `Group`
 * @alias `demote`
 * @param {string | number} groupId - A viable Group ID.
 * @param {string | number} userId - A viable User ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
    denblox.demote(00000, 00000)
   .then(() => {...})
   .catch((e) => console.error(e));
 */

export async function demote(
  groupId: number | string,
  userId: number | string,
): Promise<void> {
  if (isNaN(Number(groupId)) || isNaN(Number(userId))) {
    throw new Error("An invalid User ID or Group ID was provided.");
  }

  try {
    const user = await getUserInGroup(groupId, userId);
    const { roles } = await getGroup(groupId);

    let groupRoles = roles.map((arg) => arg.id);
    let newRole = roles[groupRoles.indexOf(user.role.id) - 1];
    if (newRole.id === roles[groupRoles.indexOf(groupRoles[0])].id) {
      throw new Error(
        `Cannot demote user lower than ${user.role.name}. Please exile this user`,
      );
    }

    await setRank(groupId, userId, newRole.id);
  } catch (error) {
    throw new Error(error);
  }

  return;
}/**
*  Sends a request to `Group` endpoint, exiling a user provided.
 * @category `Group`
 * @alias `exile`
 * @param {string | number} groupId - A viable Group ID.
 * @param {string | number} userId - A viable User ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
 * await denblox.login(`_|WARNING:-DO-NOT-SHARE-THIS.....`)
 *
*  denblox.exile("00000", "0000")
   .then(() => {....})
   .catch((e) => console.error(e))

 */

export async function exile(
  groupId: number | string,
  userId: number | string,
): Promise<void> {
  if (isNaN(Number(groupId)) || isNaN(Number(userId))) {
    throw new Error("An invalid Group Id or User Id was provided.");
  }

  let body =
    await (await request(
      `https://groups.roblox.com/v1/groups/${groupId}/users/${userId}`,
      "strict",
      {
        method: "DELETE",
      },
    )).json();

  if ("errors" in body) {
    throw (body["errors"].length <= 1)
      ? body["errors"][0]
      : body["errors"].join(", ");
  }
  return;
}
