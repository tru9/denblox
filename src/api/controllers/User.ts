
// PROFILE

interface User {
    buildersClubMemberShipType: string;
    userId: number;
    username: string;
    displayName: string;
}

export interface UserProfile {
    id: number;
    username: string;
    displayName: string;
    description: string;
    banned: boolean;
    created: Date;
}


export function getIDByUsername(username: string) {
    return new Promise<number | string>(async (resolve, reject) => {
        if (!username) reject(new Error("UserName not Provided"));
        const response = await (await fetch(`https://api.roblox.com/users/get-by-username?username=${username}`))
            .json();

        if ("errors" in response) reject(new Error(response["errors"][0].message));
        return resolve(response);
    });
}

export function getProfile(id: Number | String): Promise<UserProfile> {
    return new Promise<UserProfile>(async (resolve, reject) => {
        if (!id) return reject(new Error("Invalid User ID."))
        const response = await (await fetch(`https://users.roblox.com/v1/users/${id}`)).json();

        if ("errors" in response) reject(new Error(response["errors"][0].message));
        const modifiedProfile = { ...response };
        modifiedProfile.banned = response["isBanned"]
        modifiedProfile.created = new Date(modifiedProfile["created"]);

        return resolve(modifiedProfile);
    })
}




// GROUPS 
export interface UserGroup {
    group: {
        groupID: number;
        name: string;
        description: string;
        owner: User;
        shout: {
            body: string;
            poster: User;
            created: Date;
            updated: Date;
        } | null;
        memberCount: number;
        isBuildersClubOnly: boolean;
        publicEntryAllowed: boolean
    },

    role: {
        roleID: number;
        name: string;
        rank: number,
        userCount: number
    }
}


export function getUserGroups(id: Number | String): Promise<UserGroup[]> {
    return new Promise<UserGroup[]>(async (resolve, reject) => {
        if (!id) return reject(new Error("Invalid User ID."))
        const response = await (await fetch(`https://groups.roblox.com/v1/users/${id}/groups/roles`)).json();

        if ("errors" in response) reject(new Error(response["errors"][0].message));

        let out = [];
        for (const data of response.data) {
            const modifiedData = { ...data };
            console.log(modifiedData.group.shout)
            if (modifiedData.group.shout) {
                modifiedData.group.shout.created = new Date(data.group.shout.created);
                modifiedData.group.shout.updated = new Date(data.group.shout.updated);
            }

            out.push(modifiedData);
        }

        return resolve(out);
    })
};

// BADGES

export interface UserBadge {
    nextPageCursor: string;
    previousPageCursor: string;
    data: UserBadges[]
}

interface UserBadges {
    previousPageCursor: string;
    nextPageCursor: string;
    name: string;
    badgeId: number;
    description: string | null;
    enabled: boolean;
    iconImageId: number;
    awarder: {
        id: number;
        type: string;
        name: string
    };
    statistics: {
        pastDayAwardedCount: number;
        awardedCount: number;
        winRatePercentage: number
    };

    created: Date;
    updated: Date;
}

export function getUserBadges(id: Number | String, limit: 10 | 25 | 50 | 100, sort: "Asc" | "Desc" = "Asc", cursor?: string | null): Promise<UserBadge> {
    return new Promise<UserBadge>(async (resolve, reject) => {
        if (!id) return reject(new Error("Invalid User ID."))
        if (!limit || ![10, 25, 50, 100].includes(limit)) return reject(new Error("The allowed limit values include: 10, 25, 50, and 100."));
        if (!sort || !["asc", "desc"].includes(sort.toLowerCase())) return reject(new Error("The allowed sort values are Asc or Desc."));

        const url = (cursor) ? `https://badges.roblox.com/v1/users/${id}/badges?limit=${limit}&cursor=${cursor}&sortOrder=${sort}` : `https://badges.roblox.com/v1/users/${id}/badges?limit=${limit}&sortOrder=${sort}`
        const response = await (await fetch(url)).json();
        if ("errors" in response) return reject(new Error(response.errors[0].message));

        const out = [];
        for (const badge of response.data) {
            const modifiedBadge = { ...badge };
            modifiedBadge.created = new Date(badge.created);
            modifiedBadge.updated = new Date(badge.updated);

            // DELETE PROPERTIES
            delete modifiedBadge["displayName"];
            delete modifiedBadge["displayDescription"];
            out.push(modifiedBadge);
        }

        return resolve({
            nextPageCursor: response["nextPageCursor"],
            previousPageCursor: response["previousPageCursor"],
            data: out
        });
    })
};



// USER SEARCH

export interface UserSearch {
    nextPageCursor: string | undefined;
    previousPageCursor: string | undefined;
    data: Users[]
}

interface Users {
    id: number;
    username: string;
    previousUsernames: string[];
}

export function searchUser(query: string, limit: 10 | 25 | 50 | 100 = 10, cursor?: string): Promise<UserSearch> {
    return new Promise<UserSearch>(async (resolve, reject) => {
        if (!query) return reject(new Error("Query not provided."));
        if (!limit || ![10, 25, 50, 100].includes(limit)) return reject(new Error("The allowed limit values include: 10, 25, 50, and 100."));

        const url = (cursor) ? `https://users.roblox.com/v1/users/search?keyword=${query}&limit=${limit}&cursor=${cursor}` : `https://users.roblox.com/v1/users/search?keyword=${query}&limit=${limit}`;
        const response = await (await fetch(url)).json();

        if ("errors" in response) return reject(new Error(response.errors[0].message));
        const out = [];

        for (const user of response.data) {
            const modifiedUser = { ...user };
            delete modifiedUser.displayName;
            out.push(modifiedUser);
        };

        return resolve({
            nextPageCursor: response.nextPageCursor,
            previousPageCursor: response.previousPageCursor,
            data: out
        });
    })
}