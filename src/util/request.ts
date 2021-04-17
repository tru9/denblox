import session from "../helpers/storage.ts";
import { refreshToken } from "../helpers/refreshToken.ts";


export async function request(uri: string, req?: "CookieReq" | "Cookie&Token" | "Cookie" | undefined, init?: RequestInit | undefined): Promise<Response> {
    const requestProps: RequestInit = { ...init };

    if (requestProps.headers && "Cookie" in requestProps.headers) session.cookie = requestProps.headers["Cookie"];
    if (req === "CookieReq" && !session["cookie"]) throw new Error("Endpoint requires a User; Session not Started.");
    if (req === "CookieReq") requestProps.headers = {
        ...requestProps.headers,
        "Cookie": `${session.cookie}`
    };

    if (req === "Cookie" && session["cookie"]) requestProps.headers = {
        ...requestProps.headers,
        "Cookie": `${session.cookie}`
    };



    if (req === "Cookie&Token" && !session["cookie"]) {
        if (!session["cookie"]) throw new Error("Endpoint requires a User; Session not Started.");

        const CSRF = await refreshToken();
        if (!CSRF) throw new Error("Endpoint requires a X-CSRF-TOKEN; User Authentication Required.");
    }

    if (req === "Cookie&Token") {
        const CSRF = await refreshToken();
        if (!CSRF) throw new Error("Endpoint requires a X-CSRF-TOKEN; User Authentication Required.");

        requestProps.headers = {
            ...requestProps.headers,
            "Cookie": `${session.cookie}`,
            "X-CSRF-TOKEN": CSRF
        };
    }

    const response = await fetch(uri, requestProps);
    return response;
}






