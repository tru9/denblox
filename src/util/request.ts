import { session } from "./storage.ts";
import refreshToken from "../helpers/token.ts";

/* usages
plain - send a request with a cookie if cookie exists
normal - send a request with cookie
strict - send a request with cookie and CSRF token 
*/

export async function request(
	uri: string,
	req?: "normal" | "strict" | "plain" | undefined,
	init?: RequestInit | undefined,
): Promise<Response> {
	let props: RequestInit = { ...init };
	const cookie = session["cookie"];
	if (req && ["normal", "strict"].includes(req) && !session) {
		throw new Error("You have not logged in.");
	}

	// plain
	if (req === "plain" && session["cookie"]) {
		props.headers = {
			...props.headers,
			Cookie: `.ROBLOSECURITY=${session.cookie}`,
		};
	}

	// normal req
	if (props.headers && "Cookie" in props.headers) {
		session["cookie"] = props.headers["Cookie"];
	}
	if (cookie && req === "normal") {
		props.headers = {
			...props.headers,
			Cookie: `.ROBLOSECURITY=${session.cookie}`,
		};
	}

	// strict
	if (req === "strict") {
		const token = await refreshToken();
		if (token) {
			props.headers = {
				...props.headers,
				"Cookie": `.ROBLOSECURITY=${session.cookie}`,
				"x-csrf-token": token?.toString(),
			};
		} else {
			throw new Error(
				"You are not logged in or something went wrong with the x-csrf-token.",
			);
		}
	}

	return await fetch(uri, props);
}
