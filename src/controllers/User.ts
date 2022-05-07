import * as Types from "../typings/User.d.ts";
import { request } from "../util/request.ts";
import * as BTypes from "../typings/Badge.d.ts";

/**
 *  Sends a request to `Users` endpoint, getting details of a ROBLOX User.
 * @category `User`
 * @alias `getUserByName`
 * @param {string} username - A viable Username.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const user = await denblox.getUserByName("tru9")
   console.log(user)
 */

export async function getUserByName(username: string): Promise<Types.User> {
	if (typeof username !== "string") {
		throw new Error("An invalid username was provided.");
	}

	const body = await (
		await request(`https://api.roblox.com/users/get-by-username?username=${username}`)
	)
		.clone()
		.json();
	if ("errors" in body) {
		throw body.errors.length <= 1 ? body.errors[0] : body.errors.join(", ");
	}

	const user = await getUser(body.Id);
	return user;
}

/**
 *  Sends a request to `Users` endpoint, getting details of a ROBLOX User.
 * @category `User`
 * @alias `getUser`
 * @param {string | number} userId - A viable User ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const user = await denblox.getUser(0)
   console.log(user)
 */

export async function getUser(userId: string | number): Promise<Types.User> {
	if (isNaN(Number(userId))) {
		throw new Error("An invalid User Id was provided.");
	}

	const [body, avatar, headshot] = await Promise.all([
		request(`https://users.roblox.com/v1/users/${userId}`),
		request(
			`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=352x352&format=Png`,
		),
		request(
			`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=352x352&format=Png`,
		),
	]).then(async (res) => [...(await Promise.all(res.map((req) => req.clone().json())))]);
	if ("errors" in body) {
		throw body.errors.length <= 1 ? body.errors[0] : body.errors.join(", ");
	}

	return {
		...body,
		created: new Date(body.created),
		thumbnails: {
			body: avatar.data[0].imageUrl,
			headshot: headshot.data[0].imageUrl,
		},
	};
}

/**
 *  Sends a request to `Users` endpoint, getting all details of groups a user is in.
 * @category `User`
 * @alias `getUserGroups`
 * @param {string | number} userId - A viable User ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const userGroups = await denblox.getUserGroups(0)
   console.log(userGroups)
 */
export async function getUserGroups(
	userId: number | string,
): Promise<Types.UserGroupInterface> {
	if (isNaN(Number(userId))) {
		throw new Error("An invalid User Id was provided.");
	}

	const body = await (
		await request(`https://groups.roblox.com/v1/users/${userId}/groups/roles`)
	)
		.clone()
		.json();

	if ("errors" in body) {
		throw body["errors"].length <= 1 ? body["errors"][0] : body["errors"].join(", ");
	}

	const out: Types.UserGroup[] = [];
	body.data.forEach((element: Types.UserGroup, index: number) => {
		if (element.group.shout) {
			out.push({
				...element,
				group: {
					...element.group,
					shout: {
						...element.group.shout,
						created: new Date(body.data[index].group.shout.created),
						updated: new Date(body.data[index].group.shout.updated),
					},
				},
			});
		}
	});

	return {
		data: out,
	};
}

/**
*  Sends a request to `Users` endpoint, getting all details of badges a user has obtained.
 * @category `User`
 * @alias `getUserBadges`
 * @param {string | number} userId - A viable User ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const getUserBadges = await denblox.getUserBadges(0)
   console.log(getUserBadges)
 */

export async function getUserBadges(
	userId: number | string,
	init?: {
		limit?: 10 | 25 | 50 | 100;
		sort?: "Asc" | "Desc";
		cursor?: string;
	},
): Promise<BTypes.BadgeUserInterface> {
	if (isNaN(Number(userId))) {
		throw new Error("An invalid User Id was provided.");
	}
	const url = `https://badges.roblox.com/v1/users/${userId}/badges?limit=${
		init?.limit || 10
	}&sortOrder=${init?.sort || "Asc"}${init?.cursor ? `&cursor=${init.cursor}` : ""}`;
	const body = await (await request(url)).clone().json();
	if ("errors" in body) {
		throw body["errors"].length <= 1 ? body["errors"][0] : body["errors"].join(", ");
	}

	const out: BTypes.BadgeUser[] = [];
	body.data.forEach((element: BTypes.BadgeUser, index: number) =>
		out.push({
			...element,
			created: new Date(body.data[index].created),
			updated: new Date(body.data[index].created),
		}),
	);

	return {
		nextPageCursor: body.nextPageCursor,
		previousPageCursor: body.previousPageCursor,
		data: out,
	};
}

/**
*  Sends a request to `Users` endpoint, searching a user with a given query.
 * @category `User`
 * @alias `searchUser`
 * @param {string} query - A viable User Query.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const users = await denblox.searchUser("t_ru9")
   console.log(users)
 */

export async function searchUser(
	query: string,
	init?: {
		limit?: 10 | 25 | 50 | 100;
		cursor?: string;
	},
): Promise<Types.UserSearch> {
	if (typeof query !== "string") {
		throw new Error("An invalid query was provided.");
	}
	const url = `https://users.roblox.com/v1/users/search?keyword=${query}&limit=${
		init?.limit || 10
	}${init?.cursor ? `&cursor=${init.cursor}` : ""}`;
	const body = await (await request(url)).clone().json();

	if ("errors" in body) {
		throw body["errors"].length <= 1 ? body["errors"][0] : body["errors"].join(", ");
	}
	return body;
}

/**
*  Sends a request to `Users` endpoint, sending a friend request to a user.
 * @category `User`
 * @alias `friend`
 * @param {string | number} targetId - A viable User ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const request = await denblox.friend("2434302765")
   console.log(request.success)
 */

export async function friend(
	targetId: number | string,
): Promise<{ success: boolean; isCaptchaResponse: boolean }> {
	if (isNaN(Number(targetId))) {
		throw new Error("Endpoint requires a User ID; Missing ID.");
	}
	const body = await (
		await request(
			`https://friends.roblox.com/v1/users/${targetId}/request-friendship`,
			"strict",
			{ method: "POST" },
		)
	)
		.clone()
		.json();
	if ("errors" in body) {
		throw body["errors"].length <= 1 ? body["errors"][0] : body["errors"].join(", ");
	}

	return body;
}

/**
*  Sends a request to `Users` endpoint, following a user.
 * @category `User`
 * @alias `friend`
 * @param {string | number} targetId - A viable User ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const request = await denblox.follow("2434302765")
   console.log(request.success)
 */

export async function follow(
	targetId: number | string,
): Promise<{ success: boolean; isCaptchaResponse: boolean }> {
	if (isNaN(Number(targetId))) {
		throw new Error("An invalid Target ID was provided.");
	}
	const body = await (
		await request(`https://friends.roblox.com/v1/users/${targetId}/follow`, "strict", {
			method: "POST",
		})
	)
		.clone()
		.json();
	if ("errors" in body) {
		throw body["errors"].length <= 1 ? body["errors"][0] : body["errors"].join(", ");
	}

	return body;
}

/**
*  Sends a request to `Users` endpoint, unfollowing a user.
 * @category `User`
 * @alias `friend`
 * @param {string | number} targetId - A viable User ID.
 *
 * @example
 * import * as denblox from "https://deno.land/x/denblox/mod.ts"
 *
*  const request = await denblox.unfollow("2434302765")
   console.log(request.success)
 */

export async function unfollow(targetId: number | string): Promise<{ success: boolean }> {
	if (isNaN(Number(targetId))) {
		throw new Error("An invalid Target ID was provided.");
	}
	const response = await request(
		`https://friends.roblox.com/v1/users/${targetId}/unfollow`,
		"strict",
		{ method: "POST" },
	);
	const body = await response.json();

	if ("errors" in body) {
		throw body["errors"].length <= 1 ? body["errors"][0] : body["errors"].join(", ");
	}

	return {
		success: response.ok,
		...body,
	};
}
