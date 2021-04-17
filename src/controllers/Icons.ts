import { request } from "../util/request.ts";
// import * as Types from "../typings/Icons.ts";

export interface Icon {
    data: {
        state: string;
        targetId: number;
        imageUrl: string
    }[]
};

/**
 * Sends a request to ROBLOX's thumbnail's endpoints grabbing a User's Avatar Image.
 * @param id - Place Id(s)
 * @param init - Request Config
 * @returns Icon
 */


export async function getAvatar(id: number | string | number[] | string[], init?: {
    size?: "30x30" | "48x48" | "60x60" | "75x75" | "100x100" | "110x100" | "140x140" | "150x150" | "180x180" | "250x250" | "352x352" | "420x420" | "720x720",
    format?: "Png" | "Jpeg",
    isCircular?: true | false
}): Promise<Icon> {
    if (!id) throw new Error("Endpoint requires User ID; Missing User ID.");
    const ids = (Array.isArray(id)) ? id.join("%2C") : id;
    const url = `https://thumbnails.roblox.com/v1/users/avatar?userIds=${ids}&size=${init?.size || "30x30"}&format=${init?.format || "Png"}&isCircular=${init?.isCircular || false}`;

    const response = await request(url);
    const body = await response.json();

    if ('errors' in body) throw body.errors[0];
    return body;
}


/**
 * Sends a request to ROBLOX's thumbnail's endpoints grabbing a User's Headshot Image.
 * @param id - Place Id(s)
 * @param init - Request Config
 * @returns Icon
 */

export async function getUserHeadShot(id: number | string | number[] | string[], init?: {
    size?: "48x48" | "50x50" | "60x60" | "75x75" | "100x100" | "110x100" | "150x150" | "180x180" | "352x352" | "420x420" | "720x720",
    format?: "Png" | "Jpeg",
    isCircular?: true | false
}): Promise<Icon> {
    if (!id) throw new Error("Endpoint requires User ID; Missing User ID.");
    const ids = (Array.isArray(id)) ? id.join("%2C") : id;
    const url = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${ids}&size=${init?.size || "48x48"}&format=${init?.format || "Png"}&isCircular=${init?.isCircular || false}`;

    const response = await request(url);
    const body = await response.json();

    if ('errors' in body) throw body.errors[0];
    return body;
}


/**
 * Sends a request to ROBLOX's thumbnail's endpoints grabbing a Place Icon via ID.
 * @param id - Place Id(s)
 * @param init - Request Config
 * @returns Icon
 */
export async function getPlaceIcon(id: number | string | number[] | string[], init?: {
    size?: "50x50" | "128x128" | "150x150" | "256x256" | "512x512",
    format?: "Png" | "Jpeg",
    isCircular?: true | false
}): Promise<Icon> {
    if (!id) throw new Error("Endpoint requires Place ID; Missing Place ID.");
    const ids = (Array.isArray(id)) ? id.join("%2C") : id;
    const url = `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${ids}&size=${init?.size || "50x50"}&format=${init?.format || "Png"}&isCircular=${init?.isCircular || false}`;

    const response = await request(url);
    const body = await response.json();

    if ('errors' in body) throw body.errors[0];
    return body;
}


/**
 * Sends a request to ROBLOX's thumbnail's endpoints grabbing a Badge Icon via ID.
 * @param id - Badge Id(s)
 * @param init - Request Config
 * @returns Icon
 */
export async function getBadgeIcon(id: number | string | number[] | string[], init?: {
    format?: "Png" | "Jpeg",
    isCircular?: true | false
}): Promise<Icon> {
    if (!id) throw new Error("Endpoint requires Badge ID; Missing Badge ID.");
    const ids = (Array.isArray(id)) ? id.join("%2C") : id;
    const url = `https://thumbnails.roblox.com/v1/badges/icons?badgeIds=${ids}&size=150x150&format=${init?.format || "Png"}&isCircular=${init?.isCircular || "false"}`;

    const response = await request(url);
    const body = await response.json();

    if ('errors' in body) throw body.errors[0];
    return body;
}

/**
 * Sends a request to ROBLOX's thumbnail's endpoints grabbing a GamePass Icon via ID.
 * @param id - GamePass Id(s)
 * @param init - Request Config
 * @returns Icon
 */

export async function getGamePassIcon(id: number | number[] | string[] | string, init?: {
    format?: "Png" | "Jpeg",
    isCircular?: true | false
}): Promise<Icon> {
    if (!id) throw new Error("Endpoint requires Gamepass ID; Missing GamePass ID.");
    const ids = (Array.isArray(id)) ? id.join("%2C") : id;
    const url = `https://thumbnails.roblox.com/v1/game-passes?gamePassIds=${ids}&size=150x150&format=${init?.format || "Png"}&isCircular=${init?.isCircular || "false"}`;
    const response = await request(url);
    const body = await response.json();

    if ('errors' in body) throw body.errors[0];
    return body;
}
