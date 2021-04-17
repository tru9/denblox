import * as Types from "../typings/Group.d.ts";
import { request } from "../util/request.ts";

/**
 * Sends a Request to ROBLOX Group Endpoint fetching Group data via ID.
 * @param id - Group ID
 * @returns Group
 */

export async function getGroup(id: number | string): Promise<Types.Group> {
    if (!id) throw new Error("Endpoint requires a Group ID; Missing ID.");
    const [group, thumbnail, ranks] = await Promise.all([
        request(`https://groups.roblox.com/v1/groups/${id}`),
        request(`https://thumbnails.roblox.com/v1/groups/icons?groupIds=${id}&size=150x150&format=Png&isCircular=true`),
        request(`https://groups.roblox.com/v1/groups/${id}/roles`)
    ]).then(async responses => [...await Promise.all(responses.map(res => res.json()))])

    if ("errors" in group || "errors" in thumbnail || "errors" in ranks) throw group.errors[0] || thumbnail.errors[0] || ranks.errors[0];
    const groupIcon = thumbnail.data[0].imageUrl;
    delete ranks.groupId;

    const out = { ...group, groupIcon, ...ranks };
    if (out.shout) {
        delete out.shout.poster.displayName
        out.shout.created = new Date(group.shout.updated);
        out.shout.updated = new Date(group.shout.updated);
    };

    return out;
}

/**
 *  Sends a Request to ROBLOX Group Endpoint fetching the Group Audit-Logs via ID.
 * @param id - Group ID
 * @param init - Request Config
 * @returns Group Logs
 */

export async function getGroupLogs(id: number | string, init?: {
    sort?: "Asc" | "Desc",
    limit?: 10 | 25 | 50 | 100,
    userId?: number | string,
    actionType?: "DeletePost" | "RemoveMember" | "AcceptJoinRequest" | "DeclineJoinRequest" | "PostStatus" | "ChangeRank" | "BuyAd" | "SendAllyRequest" | "CreateEnemy" | "AcceptAllyRequest" | "DeclineAllyRequest" | "DeleteAlly" | "DeleteEnemy" | "AddGroupPlace" | "RemoveGroupPlace" | "CreateItems" | "ConfigureItems" | "SpendGroupFunds" | "ChangeOwner" | "Delete" | "AdjustCurrencyAmounts" | "Abandon" | "Claim" | "Rename" | "ChangeDescription" | "InviteToClan" | "KickFromClan" | "CancelClanInvite" | "BuyClan" | "CreateGroupAsset" | "UpdateGroupAsset" | "ConfigureGroupAsset" | "RevertGroupAsset" | "CreateGroupDeveloperProduct" | "ConfigureGroupGame" | "Lock" | "Unlock" | "CreateGamePass" | "CreateBadge" | "ConfigureBadge" | "SavePlace" | "PublishPlace" | "UpdateRolesetRank" | "UpdateRolesetData",
    cursor?: string
}): Promise<Types.Logs> {
    if (!id) throw new Error("Endpoint requires a Group ID; Missing ID.");
    let url = `https://groups.roblox.com/v1/groups/${id}/audit-log?limit=${init?.limit || 10}&sortOrder=${init?.sort || "Asc"}`;
    if (init?.userId) url += `&userId=${init.userId}`;
    if (init?.cursor) url += `&cursor=${init.cursor}`;
    if (init?.actionType) url += `&actionType=${init.actionType}`;

    const response = await request(url, "Cookie&Token");
    const body = await response.json();

    if ("errors" in body) throw body.errors[0];
    const out = [];
    for (const data of body.data) {
        const obj = { ...data };
        obj.created = new Date(data.created);
        out.push(obj);
    };

    return {
        nextPageCursor: body.nextPageCursor,
        previousPageCursor: body.previousPageCursor,
        data: out
    }
}

/**
 *  Sends a Request to ROBLOX Group Endpoint fetching Group Wall
 * @param id - Group ID
 * @param init - Request Config
 * @returns Group Wall
 */


export async function getGroupWall(id: number | string, init?: {
    sort?: "Asc" | "Desc",
    limit?: 10 | 25 | 50 | 100,
    cursor?: string
}): Promise<Types.GroupWall> {
    if (!id) throw new Error("Endpoint requires a Group ID; Missing ID.");
    let url = `https://groups.roblox.com/v1/groups/${id}/audit-log?limit=${init?.limit || 10}&sortOrder=${init?.sort || "Asc"}`;
    if (init?.cursor) url += `&cursor=${init.cursor}`;

    const response = await request(url, "Cookie");
    const body = await response.json();
    if ("errors" in body) throw body.errors[0];

    const out = [];
    for (const data of body.data) {
        const obj = { ...data };
        obj.created = new Date(data.created);
        obj.updated = new Date(data.updated);
        out.push(obj);
    };

    return {
        nextPageCursor: body.nextPageCursor,
        previousPageCursor: body.previousPageCursor,
        data: out
    }
};

/**
 *  Sends a Request to ROBLOX Group Endpoint to exile a User.
 * @param groupId - Group Id
 * @param userId - User Id
 * @returns ok - boolean
 */

export async function exileUser(groupId: number | string, userId: number | string): Promise<{ ok: boolean }> {
    if (!groupId) throw new Error("Endpoint requires a Group ID; Missing ID.");
    if (!userId) throw new Error("Endpoint requires a User ID; Missing ID.");

    let response = await request(`https://groups.roblox.com/v1/groups/${groupId}/users/${userId}`, "Cookie&Token", {
        method: "DELETE"
    });

    const body = await response.json();
    if ("errors" in body) throw body.errors[0];

    return {
        ok: response.ok
    };
};

/**
 *  Sends a Request to ROBLOX Group Endpoint fetching Group Pending join requests.
 * @param id - Group Id
 * @param init - Request Config
 * @returns ok - boolean
 */

export async function getGroupJoinRequests(id: number | string, init?: {
    sort?: "Asc" | "Desc",
    limit?: 10 | 20 | 50 | 100,
    cursor?: string,
}): Promise<Types.GroupJoinRequests> {
    if (!id) throw new Error("Endpoint requires a Group ID; Missing ID.");
    let url = `https://groups.roblox.com/v1/groups/${id}/join-requests?sortOrder=${init?.sort || "Asc"}&limit=${init?.limit || 10}`;
    if (init?.cursor) url += `&cursor=${init.cursor}`;

    const response = await request(url, "Cookie&Token");
    const body = await response.json();

    if ("errors" in body) throw body.errors[0];

    const out = [];
    for (const data of body.data) {
        const obj = { ...data };
        obj.created = new Date(data.created);
        out.push(obj);
    };

    return {
        nextPageCursor: body.nextPageCursor,
        previousPageCursor: body.previousPageCursor,
        data: out
    }

}

/**
 *  Sends a Request to ROBLOX Group Endpoint accepting a pending join request
 * @param groupId - Group Id
 * @param userId - User Id
 * @returns ok - boolean
 */

export async function acceptGroupJoinRequest(groupId: string | number, userId: string | number): Promise<{ ok: boolean }> {
    if (!groupId) throw new Error("Endpoint requires a Group ID; Missing ID.");
    if (!userId) throw new Error("Endpoint requires a User ID; Missing ID.");

    const response = await request(`https://groups.roblox.com/v1/groups/${groupId}/join-requests/users/${userId}`, "Cookie&Token", {
        method: 'POST'
    });
    const body = await response.json();
    if ("errors" in body) throw body.errors[0];

    return {
        ok: response.ok
    };
};

export async function declineGroupJoinRequest(groupId: string | number, userId: string | number): Promise<{ ok: boolean }> {
    if (!groupId) throw new Error("Endpoint requires a Group ID; Missing ID.");
    if (!userId) throw new Error("Endpoint requires a User ID; Missing ID.");

    const response = await request(`https://groups.roblox.com/v1/groups/${groupId}/join-requests/users/${userId}`, "Cookie&Token", {
        method: 'DELETE'
    });
    const body = await response.json();
    if ("errors" in body) throw body.errors[0];

    return {
        ok: response.ok
    };
};

/**
 *  Sends a Request to ROBLOX Group Endpoint and updates a User's role.
 * @param groupId - Group Id
 * @param userId - User Id
 * @param roleId - Role Id
 * @returns ok - boolean
 */


export async function updateUserRole(groupId: number | string, userId: number | string, roleId: number | string): Promise<{ ok: boolean }> {
    if (!groupId) throw new Error("Endpoint requires a Group ID; Missing Group ID.");
    if (!userId) throw new Error("Endpoint requires a User ID; Missing User ID.");
    if (!roleId) throw new Error("Endpoint requires a Role ID; Missing Role ID.");

    const response = await request(`https://groups.roblox.com/v1/groups/${groupId}/users/${userId}`, "Cookie&Token", {
        method: "PATCH",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "roleId": roleId
        })
    });
    const body = await response.json();
    if ('errors' in body) throw body.errors[0];

    return {
        ok: response.ok
    };
}