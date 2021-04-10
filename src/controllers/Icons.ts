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


export function getAvatar(ids: Number | Number[] | String | String[], size: "30x30" | "48x48" | "60x60" | "75x75" | "100x100" | "110x100" | "140x140" | "150x150" | "180x180" | "250x250" | "352x352" | "420x420" | "720x720" = "30x30", format: "Png" | "Jpeg" = "Png", isCircular: true | false = false): Promise<Icon> {
    return new Promise<Icon>(async (resolve, reject) => {
        if (!ids) return reject(new Error("Invalid User ID."))
        if (!sizes.avatar.includes(size)) return reject(new Error(`The allowed sizes include: ${sizes.avatar.join(", ")}.`));
        if (!format || !["Png", "Jpeg"].includes(format)) return reject(new Error("The allowed format sizes are Png and Jpeg."));
        if (typeof isCircular !== "boolean") reject(new Error("isCircular is a boolean!"));


        const url = (Array.isArray(ids)) ? `https://thumbnails.roblox.com/v1/users/avatar?userIds=${ids.join("%2C")}&size=${size}&format=${format}&isCircular=${isCircular}` : `https://thumbnails.roblox.com/v1/users/avatar?userIds=${ids}&size=${size}&format=${format}&isCircular=${isCircular}`;
        const response = await (await fetch(url)).json();

        if ("errors" in response) reject(new Error(response["errors"][0].message));
        return resolve(response.data);
    })
}

// HEAD-SHOTS

export function getHeadShots(ids: Number | Number[] | String | String[], size: "48x48" | "50x50" | "60x60" | "75x75" | "100x100" | "110x100" | "150x150" | "180x180" | "352x352" | "420x420" | "720x720" = "48x48", format: "Png" | "Jpeg" = "Png", isCircular: true | false = false): Promise<Icon> {
    return new Promise<Icon>(async (resolve, reject) => {
        if (!ids) return reject(new Error("Invalid User ID."))
        if (!sizes["head-shot"].includes(size)) return reject(new Error(`The allowed sizes include: ${sizes["head-shot"].join(", ")}.`));
        if (!format || !["Png", "Jpeg"].includes(format)) return reject(new Error("The allowed format sizes are Png and Jpeg."));
        if (typeof isCircular !== "boolean") reject(new Error("isCircular is a boolean!"));


        const url = (Array.isArray(ids)) ? `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${ids.join("%2C")}&size=${size}&format=${format}&isCircular=${isCircular}` : `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${ids}&size=${size}&format=${format}&isCircular=${isCircular}`;
        const response = await (await fetch(url)).json();

        if ("errors" in response) reject(new Error(response["errors"][0].message));
        return resolve(response.data);
    })
}


// PLACE 

export function placeIcon(ids: Number | Number[] | String | String[], size: "50x50" | "128x128" | "150x150" | "256x256" | "512x512" = "50x50", format: "Png" | "Jpeg" = "Png", isCircular: true | false = false): Promise<Icon> {
    return new Promise<Icon>(async (resolve, reject) => {
        if (!ids) return reject(new Error("Invalid User ID."))
        if (!sizes.place.includes(size)) return reject(new Error(`The allowed sizes include: ${sizes.place.join(", ")}.`));
        if (!format || !["Png", "Jpeg"].includes(format)) return reject(new Error("The allowed format sizes are Png and Jpeg."));
        if (typeof isCircular !== "boolean") reject(new Error("isCircular is a boolean!"));


        const url = (Array.isArray(ids)) ? `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${ids.join("%2C")}&size=${size}&format=${format}&isCircular=${isCircular}` : `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${ids}&size=${size}&format=${format}&isCircular=${isCircular}`;
        const response = await (await fetch(url)).json();

        if ("errors" in response) reject(new Error(response["errors"][0].message));
        return resolve(response.data);
    })
}


// BADGE


export function badgeIcon(ids: Number | Number[] | String | String[], size: "150x150" = "150x150", format: "Png" | "Jpeg" = "Png", isCircular: true | false = false): Promise<Icon> {
    return new Promise<Icon>(async (resolve, reject) => {
        if (!ids) return reject(new Error("Invalid User ID."))
        if (size !== "150x150") return reject(new Error(`The allowed sizes include: 150x150.`));
        if (!format || !["Png", "Jpeg"].includes(format)) return reject(new Error("The allowed format sizes are Png and Jpeg."));
        if (typeof isCircular !== "boolean") reject(new Error("isCircular is a boolean!"));


        const url = (Array.isArray(ids)) ? `https://thumbnails.roblox.com/v1/badges/icons?badgeIds=${ids}&size=${size}&format=${format}&isCircular=${isCircular}` : `https://thumbnails.roblox.com/v1/badges/icons?badgeIds=${ids}&size=${size}&format=${format}`;
        const response = await (await fetch(url)).json();
        if ("errors" in response) reject(new Error(response["errors"][0].message));
        return resolve(response);
    })
}


// GAMEPASSES 

export function gamepassIcon(ids: Number | Number[] | String | String[], size: "150x150" = "150x150", format: "Png" | "Jpeg" = "Png", isCircular: true | false = false): Promise<Icon> {
    return new Promise<Icon>(async (resolve, reject) => {
        if (!ids) return reject(new Error("Invalid User ID."))
        if (size !== "150x150") return reject(new Error(`The allowed sizes include: 150x150.`));
        if (!format || !["Png", "Jpeg"].includes(format)) return reject(new Error("The allowed format sizes are Png and Jpeg."));
        if (typeof isCircular !== "boolean") reject(new Error("isCircular is a boolean!"));


        const url = (Array.isArray(ids)) ? `https://thumbnails.roblox.com/v1/game-passes?gamePassIds=${ids}&size=${size}&format=${format}&isCircular=${isCircular}` : `https://thumbnails.roblox.com/v1/game-passes?gamePassIds=${ids}&size=${size}&format=${format}`;
        const response = await (await fetch(url)).json();
        if ("errors" in response) reject(new Error(response["errors"][0].message));
        return resolve(response);
    })
}
