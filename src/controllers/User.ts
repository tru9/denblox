import { User, UsernameSearch, UserGroups, UserBadges, UserSearch } from "../typings/User.ts";
import { getCSRFToken } from "../helpers/session.ts"
import storage from "../helpers/storage.ts";


export async function getIDFromUsername(username: string): Promise<UsernameSearch> {
    if (!username) throw new Error("Username cannot be empty");
    const url = `https://api.roblox.com/users/get-by-username?username=${username}`;
    const response = await fetch(url);
    const body = await response.json();

    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `User Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    return {
        username: username,
        id: body.Id
    }
}

export async function getUserProfile(id: number | string): Promise<User> {
    const idChecker = new RegExp('^[0-9]+$');
    if (!idChecker.test(id.toString())) throw new Error("Invalid User ID.");

    const [response, user, ...avatars] = await Promise.all([
        fetch(`https://users.roblox.com/v1/users/${id}`),
        fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${id}&size=352x352&format=Png`),
        fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=352x352&format=Png`)
    ]).then(async (res) => {
        return [res[0], ...await Promise.all(res.map((response) => response.json()))]
    })

    const avatar = avatars[0].data[0].imageUrl || null;
    const headshot = avatars[1].data[0].imageUrl || null;

    if (response.status !== 200 || "errors" in user) {
        throw {
            ok: response.ok,
            errors: user["errors"][0] || {
                code: response.status,
                message: `User Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    const out = {
        ...user, avatars: {
            bodyUrl: avatar,
            headshotUrl: headshot,
        }
    }

    delete out.displayName;
    out.created = new Date(user.created);
    return out;
};



export async function getUserGroups(id: number | string): Promise<UserGroups[]> {
    const idChecker = new RegExp('^[0-9]+$');
    if (!idChecker.test(id.toString())) throw new Error("Invalid User ID.");

    const url = `https://groups.roblox.com/v1/users/${id}/groups/roles`;
    const response = await fetch(url);
    const body = await response.json();

    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `User Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    const out = [];
    for (const key of body.data) {
        const obj = { ...key };
        const { shout, owner } = obj.group;
        delete owner.displayName;
        if (shout) {
            shout.created = new Date(key.group.shout.created);
            shout.updated = new Date(key.group.shout.updated);
        }
        out.push(obj);
    };

    return out;

}
// BADGES

export async function getUserBadges(userId: number | string, config?: {
    limit?: 10 | 25 | 50 | 100,
    sort?: "Asc" | "Desc",
    cursor?: string;
}): Promise<UserBadges> {
    const idChecker = new RegExp('^[0-9]+$');
    if (!idChecker.test(userId.toString())) throw new Error("Invalid User ID.");

    let url = `https://badges.roblox.com/v1/users/${userId}/badges?limit=${config?.limit || 10}&sortOrder=${config?.sort || "Asc"}`;
    if (config?.cursor) url += `&cursor=${config?.cursor}`;
    const response = await fetch(url);
    const body = await response.json();

    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `User Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    const out = [];
    for (const badge of body.data) {
        const obj = { ...badge };
        obj.created = new Date(badge.created);
        obj.updated = new Date(badge.updated);
        delete obj.displayName;
        delete obj.displayIconImageId;
        out.push(obj);
    };

    return {
        nextPageCursor: body.nextPageCursor,
        previousPageCursor: body.previousPageCursor,
        data: out
    };

};

// USER SEARCH

export async function userSearch(query: string, config?: {
    limit?: 10 | 25 | 50 | 100,
    cursor?: string
}): Promise<UserSearch> {
    if (!query) throw new Error("Invalid Query.");
    let url = `https://users.roblox.com/v1/users/search?keyword=${query}&limit=${config?.limit || 10}`;
    if (config?.cursor) url += `&cursor=${config.cursor}`;

    const response = await fetch(url);
    const body = await response.json();

    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `User Request Failed; Left with an error code of ${response.status}`
            }
        }
    }

    return body;
};


export async function requestFriendship(targetId: number | string): Promise<{ success: boolean, isCaptchaResponse: boolean }> {
    const idChecker = new RegExp('^[0-9]+$');
    if (!idChecker.test(targetId.toString())) throw new Error("Invalid User ID.");

    const { token } = await getCSRFToken();
    let url = `https://friends.roblox.com/v1/users/${targetId}/request-friendship`;
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Cookie": `.ROBLOSECURITY=${storage.cookie}`,
            "X-CSRF-TOKEN": token
        }
    });

    const body = await response.json();
    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `Friend Request Failed; Left with an error code of ${response.status}`
            }
        }
    }

    return body;
}

export async function follow(targetId: number | string): Promise<{ success: boolean, isCaptchaResponse: boolean }> {
    const idChecker = new RegExp('^[0-9]+$');
    if (!idChecker.test(targetId.toString())) throw new Error("Invalid User ID.");

    const { token } = await getCSRFToken();
    let url = `https://friends.roblox.com/v1/users/${targetId}/follow`;
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Cookie": `.ROBLOSECURITY=${storage.cookie}`,
            "X-CSRF-TOKEN": token
        }
    });

    const body = await response.json();
    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `Follow Request Failed; Left with an error code of ${response.status}`
            }
        }
    }

    return body;
}


export async function unfollow(targetId: number | string): Promise<{ success: boolean }> {
    const idChecker = new RegExp('^[0-9]+$');
    if (!idChecker.test(targetId.toString())) throw new Error("Invalid User ID.");

    const { token } = await getCSRFToken();
    let url = `https://friends.roblox.com/v1/users/${targetId}/unfollow`;
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Cookie": `.ROBLOSECURITY=${storage.cookie}`,
            "X-CSRF-TOKEN": token
        }
    });

    const body = await response.json();
    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `Follow Request Failed; Left with an error code of ${response.status}`
            }
        }
    }

    return {
        success: true,
        ...body
    };
}


