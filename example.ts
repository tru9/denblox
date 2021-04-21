import * as denblox from "./mod.ts";

const username = prompt("Input Roblox Username:");
if (!username) {
  console.log("No username provided.");
  Deno.exit();
}

try {
  const user = await denblox.getUserByName(username);
  console.log(user);
} catch (error) {
  throw new Error(error);
}
