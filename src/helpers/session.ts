import session from "./storage.ts";

export async function getAuthenticatedUser(): Promise<{ id: string | number, name: string }> {
    const response = await fetch('https://users.roblox.com/v1/users/authenticated', {
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
                message: `Authenticated Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    delete body.displayName

    return body;
}


export async function getCSRFToken(): Promise<{ token: string }> {
    const response = await fetch("https://auth.roblox.com/v2/logout", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Cookie": `.ROBLOSECURITY=${session.cookie}`
        }
    })

    const token = response.headers.get("x-csrf-token");
    if (!token) throw new Error("X-CSRF-TOKEN not found.");
    session['x-csrf-token'] = token;

    return {
        token,
        ...await response.json()
    };
};


interface AuthenticatedUser {
    id: number;
    username: string;
}

export async function startSession(cookie: string): Promise<AuthenticatedUser> {
    if (!cookie) throw {
        status: 400,
        message: "Cookie not Provided."
    };

    const response = await fetch('https://users.roblox.com/v1/users/authenticated', {
        headers: {
            "Content-type": "application/json",
            "Cookie": `.ROBLOSECURITY=${cookie}`
        }
    });
    const body = await response.json();

    if (response.status !== 200 || "errors" in body) {
        throw {
            ok: response.ok,
            errors: body["errors"][0] || {
                code: response.status,
                message: `Login Request Failed; Left with an error code of ${response.status}`
            }
        }
    };

    const out = { ...body };
    delete out.displayName

    session.cookie = cookie;
    return out;
}