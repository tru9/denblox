import session from "./storage.ts";

interface AuthenticatedUser {
    id: number;
    username: string;
}

export function startSession(cookie: string) {
    return new Promise(async (resolve, reject) => {
        if (!cookie) return reject({
            status: 400,
            message: "Cookie not Provided."
        });

        const response = await fetch('https://users.roblox.com/v1/users/authenticated', {
            headers: {
                "Content-type": "application/json",
                "Cookie": `.ROBLOSECURITY=${cookie}`
            }
        });
        const body = await response.json();

        if (response.status !== 200 || "errors" in body) {
            return reject({
                ok: response.ok,
                errors: body["errors"][0] || {
                    code: response.status,
                    message: `Login Request Failed; Left with an error code of ${response.status}`
                }
            })
        };

        const out = { ...body };
        delete out.displayName

        session.cookie = cookie;
        return resolve(out);
    })
}