import * as denblox from "./mod.ts";

const username = prompt("Input Roblox Username:");
if (!username) {
	console.log("No username provided.");
	Deno.exit();
}

try {
	const user = await denblox.getUserByName(username);
	const group = await denblox.getUserInGroup(3140367, user.id);

	console.log(group);
} catch (error) {
	throw new Error(error);
}
