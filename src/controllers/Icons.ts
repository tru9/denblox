import { IconData } from "../typings/Icons.ts";

const sizes = {
    avatar: ["30x30", "48x48", "60x60", "75x75", "100x100", "110x100", "140x140", "150x150", "180x180", "250x250", "352x352", "420x420", "720x720"],
    place: ["50x50", "128x128", "150x150", "256x256", "512x512"],
    "head-shot": ["48x48", "50x50", "60x60", "75x75", "100x100", "110x100", "150x150", "180x180", "352x352", "420x420", "720x720"],
}

export interface Icon {
    data: {
        state: string;
        targetId: number;
        imageUrl: string;
    }[]
}

// AVATARS
export async function getAvatar(targetId: number | number[] | string[] | string, config?: {
    size?: "30x30" | "48x48" | "60x60" | "75x75" | "100x100" | "110x100" | "140x140" | "150x150" | "180x180" | "250x250" | "352x352" | "420x420" | "720x720",
    format?: "Png" | "Jpeg",
    isCircular?: true | false
}): Promise<IconData> {
    if (!targetId) throw new Error("Invalid Target ID.");
    const ids = (Array.isArray(targetId)) ? targetId.join("%2C") : targetId;
    const url = `https://thumbnails.roblox.com/v1/users/avatar?userIds=${ids}&size=${config?.size || "30x30"}&format=${config?.format || "Png"}&isCircular=${config?.isCircular || "false"}`;

    const response = await fetch(url);
    const body = await response.json();

    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `Avatar Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    return body;
}

// HEAD-SHOTS

export async function getUserHeadShot(targetId: number | number[] | string[] | string, config?: {
    size?: "48x48" | "50x50" | "60x60" | "75x75" | "100x100" | "110x100" | "150x150" | "180x180" | "352x352" | "420x420" | "720x720",
    format?: "Png" | "Jpeg",
    isCircular?: true | false
}): Promise<IconData> {
    if (!targetId) throw new Error("Invalid Target ID.");
    const ids = (Array.isArray(targetId)) ? targetId.join("%2C") : targetId;
    const url = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${ids}&size=${config?.size || "48x48"}&format=${config?.format || "Png"}&isCircular=${config?.isCircular || "false"}`;

    const response = await fetch(url);
    const body = await response.json();

    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `Avatar Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    return body;
}


// PLACE 

export async function getPlaceIcon(targetId: number | number[] | string[] | string, config?: {
    size?: "50x50" | "128x1208" | "150x150" | "256x256" | "512x512",
    format?: "Png" | "Jpeg",
    isCircular?: true | false
}): Promise<IconData> {
    if (!targetId) throw new Error("Invalid Target ID.");
    const ids = (Array.isArray(targetId)) ? targetId.join("%2C") : targetId;
    const url = `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${ids}&size=${config?.size || "50x50"}&format=${config?.format || "Png"}&isCircular=${config?.isCircular || "false"}`;

    const response = await fetch(url);
    const body = await response.json();

    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `Avatar Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    return body;
}


// BADGE


export async function getBadgeIcon(targetId: number | number[] | string[] | string, config?: {
    size?: "150x150",
    format?: "Png" | "Jpeg",
    isCircular?: true | false
}): Promise<IconData> {
    if (!targetId) throw new Error("Invalid Target ID.");
    const ids = (Array.isArray(targetId)) ? targetId.join("%2C") : targetId;
    const url = `https://thumbnails.roblox.com/v1/badges/icons?badgeIds=${ids}&size=${config?.size || "150x150"}&format=${config?.format || "Png"}&isCircular=${config?.isCircular || "false"}`;

    const response = await fetch(url);
    const body = await response.json();

    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `Avatar Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    return body;
}

// GAMEPASSES 



export async function getGamepassIcon(targetId: number | number[] | string[] | string, config?: {
    size?: "150x150",
    format?: "Png" | "Jpeg",
    isCircular?: true | false
}): Promise<IconData> {
    if (!targetId) throw new Error("Invalid Target ID.");
    const ids = (Array.isArray(targetId)) ? targetId.join("%2C") : targetId;
    const url = `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${ids}&size=${config?.size || "150x150"}&format=${config?.format || "Png"}&isCircular=${config?.isCircular || "false"}`;

    const response = await fetch(url);
    const body = await response.json();

    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `Avatar Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    return body;
}