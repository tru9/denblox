import * as denblox from "./mod.ts";

Deno.test({
  name: "denblox controller testing",
  async fn() {
    // await denblox.login(cookie);
    const response = await denblox.getUserByName("t_ru9");

    console.log(response);
  },
});
