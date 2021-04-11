import { Group, Logs, GroupWall, ExileUser, GroupJoinRequests } from "../typings/Group.ts";
import session from "../helpers/storage.ts";
import { getCSRFToken } from "../helpers/session.ts";

export async function getGroup(id: number | string): Promise<Group> {
    const checkID = new RegExp('^[0-9]+$');
    if (!checkID.test(id.toString())) throw new Error("Invalid Group ID.");
    const [response, group, thumbnail, ranks] = await Promise.all([
        fetch(`https://groups.roblox.com/v1/groups/${id}`),
        fetch(`https://thumbnails.roblox.com/v1/groups/icons?groupIds=${id}&size=150x150&format=Png&isCircular=true`),
        fetch(`https://groups.roblox.com/v1/groups/${id}/roles`)
    ]).then(async (res) => {
        return [res[0], ...await Promise.all(res.map((response) => response.json()))]
    })

    if (response.status !== 200 || "errors" in group) {
        throw {
            ok: response.ok,
            errors: group["errors"][0] || {
                code: response.status,
                message: `Group Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    const icon = thumbnail.data[0].imageUrl;
    delete ranks.groupId;
    const out = { ...group, icon, ...ranks };
    delete out.owner.displayName

    if (out.shout) {
        delete out.shout.poster.displayName
        out.shout.created = new Date(group.shout.updated);
        out.shout.updated = new Date(group.shout.updated);
    };

    return out;
};


const types = ["DeletePost", "RemoveMember", "AcceptJoinRequest", "DeclineJoinRequest", "PostStatus", "ChangeRank", "BuyAd", "SendAllyRequest", "CreateEnemy", "AcceptAllyRequest", "DeclineAllyRequest", "DeleteAlly", "DeleteEnemy", "AddGroupPlace", "RemoveGroupPlace", "CreateItems", "ConfigureItems", "SpendGroupFunds", "ChangeOwner", "Delete", "AdjustCurrencyAmounts", "Abandon", "Claim", "Rename", "ChangeDescription", "InviteToClan", "KickFromClan", "CancelClanInvite", "BuyClan", "CreateGroupAsset", "UpdateGroupAsset", "ConfigureGroupAsset", "RevertGroupAsset", "CreateGroupDeveloperProduct", "ConfigureGroupGame", "Lock", "Unlock", "CreateGamePass", "CreateBadge", "ConfigureBadge", "SavePlace", "PublishPlace", "UpdateRolesetRank", "UpdateRolesetData"]

export async function getAuditLogs(id: number | string, config?: {
    sort?: "Asc" | "Desc",
    limit?: 10 | 25 | 50 | 100,
    userId?: number | string,
    actionType?: "DeletePost" | "RemoveMember" | "AcceptJoinRequest" | "DeclineJoinRequest" | "PostStatus" | "ChangeRank" | "BuyAd" | "SendAllyRequest" | "CreateEnemy" | "AcceptAllyRequest" | "DeclineAllyRequest" | "DeleteAlly" | "DeleteEnemy" | "AddGroupPlace" | "RemoveGroupPlace" | "CreateItems" | "ConfigureItems" | "SpendGroupFunds" | "ChangeOwner" | "Delete" | "AdjustCurrencyAmounts" | "Abandon" | "Claim" | "Rename" | "ChangeDescription" | "InviteToClan" | "KickFromClan" | "CancelClanInvite" | "BuyClan" | "CreateGroupAsset" | "UpdateGroupAsset" | "ConfigureGroupAsset" | "RevertGroupAsset" | "CreateGroupDeveloperProduct" | "ConfigureGroupGame" | "Lock" | "Unlock" | "CreateGamePass" | "CreateBadge" | "ConfigureBadge" | "SavePlace" | "PublishPlace" | "UpdateRolesetRank" | "UpdateRolesetData",
    cursor?: string
}): Promise<Logs> {
    const checkID = new RegExp('^[0-9]+$');
    if (!checkID.test(id.toString())) throw new Error("Invalid Group ID.");
    if (config?.limit && ![10, 25, 50, 100].includes(config?.limit)) throw new Error("The allowed limit values include: 10, 25, 50, and 100.");
    if (config?.sort && !["asc", "desc"].includes(config?.sort.toLowerCase())) throw new Error("The allowed sort values are Asc or Desc.");
    if (config?.actionType && !types.includes(config.actionType)) throw new Error(`The allowed actionType values are: ${types.join(", ")}`);

    let url = `https://groups.roblox.com/v1/groups/${id}/audit-log?sortOrder=${config?.sort || "Asc"}&limit=${config?.limit || 10}`;
    if (config) {
        const keys = Object.keys(config);
        for (let x = 0; x < keys.length; x++) {
            const key = keys[x];
            const value = Object.values(config)[x];
            if (url.includes(key)) {
                url += `&${key}=${value}`
            }
        };
    };

    const response = await fetch(url, {
        headers: {
            "Content-type": "application/json",
            "Cookie": `.ROBLOSECURITY=${session.cookie}`
        }
    });

    const body = await response.json();
    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `Group Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    const out = [];
    for (const log of body.data) {
        const modifiedLog = { ...log };
        modifiedLog.created = new Date(log.created);
        out.push(modifiedLog);
    }

    return {
        nextPageCursor: body.nextPageCursor,
        previousPageCursor: body.previousPageCursor,
        data: out
    };
}


export async function getGroupWall(id: number | string, config?: {
    sort?: "Asc" | "Desc",
    limit?: 10 | 25 | 50 | 100,
    cursor?: string
}): Promise<GroupWall> {
    const checkID = new RegExp('^[0-9]+$');
    if (!checkID.test(id.toString())) throw new Error("Invalid Group ID."); if (config?.limit && ![10, 25, 50, 100].includes(config.limit)) throw new Error("The allowed limit values include: 10, 25, 50, and 100.");
    if (config?.sort && !["asc", "desc"].includes(config.sort.toLowerCase())) throw new Error("The allowed sort values are Asc or Desc.");

    let url = `https://groups.roblox.com/v2/groups/${id}/wall/posts?sortOrder=${config?.sort || "Asc"}&limit=${config?.limit || 10}`;
    if (config?.cursor) url += `&cursor=${config.cursor}`;

    const response = (session.cookie) ? await fetch(url, {
        headers: {
            "Cookie": `.ROBLOSECURITY=${session.cookie}`
        }
    }) : await fetch(url);
    const body = await response.json();
    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `Group Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    const out = [];
    for (const post of body.data) {
        const modifiedPost = { ...post };
        modifiedPost.created = new Date(post.created);
        modifiedPost.updated = new Date(post.updated);
        out.push(modifiedPost);
    };

    return {
        nextPageCursor: body.nextPageCursor,
        previousPageCursor: body.previousPageCursor,
        data: out
    };
}

export async function exileUser(groupId: number | string, userId: number | string): Promise<ExileUser> {
    const checkID = new RegExp('^[0-9]+$');
    if (!checkID.test(userId.toString())) throw new Error("Invalid User ID.");
    if (!checkID.test(groupId.toString())) throw new Error("Invalid Group ID");

    let url = `https://groups.roblox.com/v1/groups/${groupId}/users/${userId}`;
    let { token } = await getCSRFToken();
    let response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Cookie": `.ROBLOSECURITY=${session.cookie}`,
            "X-CSRF-TOKEN": token,
        }
    });
    const body = await response.json();

    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `Group Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    return {
        ok: response.ok,
    }
}

export async function getGroupJoinRequests(id: number | string, config?: {
    sort?: "Asc" | "Desc",
    limit?: 10 | 25 | 50 | 100,
    cursor?: string
}): Promise<GroupJoinRequests> {
    const checkID = new RegExp('^[0-9]+$');
    if (!checkID.test(id.toString())) throw new Error("Invalid Group ID.");
    if (config?.limit && ![10, 25, 50, 100].includes(config.limit)) throw new Error("The allowed limit values include: 10, 25, 50, and 100.");
    if (config?.sort && !["asc", "desc"].includes(config.sort.toLowerCase())) throw new Error("The allowed sort values are Asc or Desc.");

    let url = `https://groups.roblox.com/v1/groups/${id}/join-requests?sortOrder=${config?.sort || "Asc"}&limit=${config?.limit || 10}`;
    if (config?.cursor) url += `&cursor=${config.cursor}`;
    let { token } = await getCSRFToken();

    const response = await fetch(url, {
        headers: {
            "Cookie": `.ROBLOSECURITY=${session.cookie}`,
            "X-CSRF-TOKEN": token
        }
    });

    const body = await response.json();
    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `Group Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    const out = [];
    for (const user of body.data) {
        const data = { ...user };
        data.created = new Date(user.created);
        out.push(data);
    }

    return {
        nextPageCursor: body.nextPageCursor,
        previousPageCursor: body.previousPageCursor,
        data: out
    }
}