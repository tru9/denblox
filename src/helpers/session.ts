import session from "./storage.ts";

export function getAuthenticatedUser(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        const response = await fetch('https://users.roblox.com/v1/users/authenticated', {
            headers: {
                "Content-type": "application/json",
                "Cookie": `.ROBLOSECURITY=${session.cookie}`
            }
        });
        const body = await response.json();

        if (response.status !== 200 || "errors" in body) {
            return reject({
                ok: response.ok,
                errors: body["errors"][0] || {
                    code: response.status,
                    message: `Authenticated Request Failed; Left with an error code of ${response.status}`
                }
            })
        };
        return resolve();
    })

}


export function getCSRFToken(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        const response = await fetch("https://auth.roblox.com/v2/logout", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Cookie": `.ROBLOSECURITY=${session.cookie}`
            }
        })

        const token = response.headers.get("x-csrf-token");
        if (!token) return reject(new Error("X-CSRF-TOKEN not found."));
        session['x-csrf-token'] = token;
        return resolve(token);
    })
};
