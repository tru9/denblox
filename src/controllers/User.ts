import * as types from "../typings/User.d.ts";
import { refreshToken } from "../helpers/refreshToken.ts";
import storage from "../helpers/storage.ts";
import { request } from "../util/request.ts";

/**
 * Sends a request to check the current authenticated user while sending the cookie provided as well.
 * @returns An Authenticated User
 */

export async function getAuthenticatedUser(): Promise<types.AuthenticatedUser> {
    const response = await request(
        "https://users.roblox.com/v1/users/authenticated",
        "CookieReq"
    );
    const body = await response.json();

    if ("errors" in body) throw body.errors[0];
    return body;
}

/**
 * Sends a request to more than one API endpoints getting information related to a ROBLOX User ID.
 * @param id - User ID
 * @returns A User object
 */

export async function getUser(id: string | number): Promise<types.User> {
    if (!id) throw new Error("Endpoint requires a ID; Missing ID Parameter.");

    const [user, avatar, headshot] = await Promise.all([
        request(`https://users.roblox.com/v1/users/${id}`),
        request(
            `https://thumbnails.roblox.com/v1/users/avatar?userIds=${id}&size=352x352&format=Png`
        ),
        request(
            `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=352x352&format=Png`
        ),
    ]).then(async (res) => [
        ...(await Promise.all(res.map((req) => req.json()))),
    ]);

    if ("error" in user) throw user.errors[0];
    return {
        ...user,
        avatarUrl: avatar.data[0].imageUrl,
        headshotUrl: headshot.data[0].imageUrl,
    };
}

/**
 * Sends a request to the ROBLOX Group Endpoint, Getting a specific user's groups & roles.
 * @param id - User ID
 * @returns A Collection of User groups.
 */

export async function getUserGroups(
    id: number | string
): Promise<types.UserGroup[]> {
    if (!id) throw new Error("Endpoint requires ID; Missing ID parameter.");
    const response = await request(
        `https://groups.roblox.com/v1/users/${id}/groups/roles`
    );
    const body = await response.json();

    if ("errors" in body) throw body.errors[0];
    const out = [];
    for (const data of body.data) {
        const obj = { ...data };
        if (obj.group.shout) {
            obj.group.shout.created = new Date(data.group.shout.created);
            obj.group.shout.updated = new Date(data.group.shout.updated);
        }
        out.push(obj);
    }

    return out;
}

/**
 * Send a request to the badge's endpoint getting a user's badges by ID. Set additional properties in the `init` parameter.
 * @param id - User ID
 * @param init - Request Config
 * @returns User Badges
 */

export async function getUserBadges(
    id: number | string,
    init?: {
        limit?: 10 | 25 | 50 | 100;
        sort?: "Asc" | "Desc";
        cursor?: string;
    }
): Promise<types.UserBadges> {
    if (!id) throw new Error("Endpoint requires ID; Missing ID parameter.");
    let url = `https://badges.roblox.com/v1/users/${id}/badges?limit=${init?.limit || 10
        }&sortOrder=${init?.sort || "Asc"}`;
    if (init?.cursor) url += `&cursor=${init?.cursor}`;

    const response = await request(url);
    const body = await response.json();

    if ("errors" in body) throw body.errors[0];

    const out = [];
    for (const data of body.data) {
        const obj = { ...data };
        obj.created = new Date(data.created);
        obj.updated = new Date(data.updated);
        out.push(obj);
    }

    return {
        nextPageCursor: body.nextPageCursor,
        previousPageCursor: body.previousPageCursor,
        data: out,
    };
}

/**
 * Sends a request with a query to lookup a user. Set additional properties in the `init` parameter.
 * @param query - Query
 * @param init - Request Config
 * @returns UserSearch
 */

export async function searchUser(
    query: string,
    init?: {
        limit?: 10 | 25 | 50 | 100;
        cursor?: string;
    }
): Promise<types.UserSearch> {
    if (!query) throw new Error("Endpoint requires a query; Missing Query.");
    let url = `https://users.roblox.com/v1/users/search?keyword=${query}&limit=${init?.limit || 10
        }`;
    if (init?.cursor) url += `&cursor=${init.cursor}`;

    const response = await request(url);
    const body = await response.json();

    if ("errors" in body) throw body["errors"][0];
    return body;
}

/**
 * Sends a friend request to a specified user via ID.
 * @param id - User ID
 */

export async function friend(id: number | string): Promise<{ success: boolean, isCaptchaResponse: boolean }> {
    if (!id) throw new Error("Endpoint requires a User ID; Missing ID.");
    const response = await request(`https://friends.roblox.com/v1/users/${id}/request-friendship`, "Cookie&Token", { method: "POST" });
    const body = await response.json();

    if ("errors" in body) throw body["errors"][0];
    return body;
}

/**
 * Follows a given user based on their ID.
 * @param id - User ID
 * @returns Booleans
 */

export async function follow(id: number | string): Promise<{ success: boolean, isCaptchaResponse: boolean }> {
    if (!id) throw new Error("Endpoint requires a User ID; Missing ID.");
    const response = await request(`https://friends.roblox.com/v1/users/${id}/follow`, "Cookie&Token", { method: "POST" });
    const body = await response.json();
    if ("errors" in body) throw body["errors"][0];
    return body;
}

/**
 * Unfollows a given user based on their ID.
 * @param id - User Id
 * @returns Boolean
 */

export async function unfollow(id: number | string): Promise<{ success: boolean }> {
    if (!id) throw new Error("Endpoint requires a User ID; Missing ID.");
    const response = await request(`https://friends.roblox.com/v1/users/${id}/unfollow`, "Cookie&Token", { method: "POST" });
    const body = await response.json();
    if ("errors" in body) throw body["errors"][0];
    return {
        success: true,
        ...body
    };
}
