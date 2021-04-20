<h1 align="center">
    <img src="./denblox.png" alt="denblox" width="450"/>
    <br>
</h1>

<h3 align="center">An easy to operate Roblox API Library for Deno<h3 align="center">
<p align="center">
    <a href='https://github.com/tru9/denblox'><img src="https://img.shields.io/github/languages/code-size/tru9/denblox?color=7EC27E&style=for-the-badge" alt="Github Code Size"/></a>
    <a href="https://github.com/tru9/denblox/issues"><img src="https://img.shields.io/github/issues/tru9/denblox?color=7EC27E&style=for-the-badge" alt="Github Issues"/></a>
    <a href="https://github.com/tru9/denblox/blob/main/LICENSE"><img src="https://img.shields.io/github/license/tru9/denblox?color=7EC27E&style=for-the-badge" alt="Github License"/>
        <a href="https://deno.land/x/denblox"><img src="https://img.shields.io/badge/package-denblox-7EC27E?style=for-the-badge"/></a>
</p>

<h1 align="center">
About
<br>
</h1>

<p align="center">
Denblox is a Roblox API Library that is open-sourced. Denblox was designed to make it easier to support ROBLOX without having to write your own API Wrapper. This Library offers multiple functions giving you more access to Roblox.
</p>

# Constructing

---

### Example

For a quick example of denblox, run this in your terminal. You'll then be
prompted for a Roblox Username.

```js
deno run --allow-net https://deno.land/x/denblox/example.ts
```

### Importing

You can import denblox via the mod.ts file, If you need anything else for
another cause you can import them at the main
[package](https://deno.land/x/denblox/mod.ts).

**_Requirements_**

- Deno Installed

```js
import * as denblox from "https://deno.land/x/denblox/mod.ts";
```

### Example

This is a self-explanatory header, but this shows you some basics and how to use
the library.

```js
import * as denblox from "https://deno.land/x/denblox/mod.ts";

await denblox.login("|WARNING:-DO-NOT-SHARE-THIS....");

const user = await denblox.getUserByName("t_ru9");
console.log(user);
```

# Other

Unnecessary information you might need.

---

- **_Version_** - v1.0
- **_Socials_** - Github - [tru9](https://github.com/tru9/) Twitter -
  [tru9](https://twitter.com/tru9_) Support Server -
  [Discord](https://discord.gg/F5xuN4aV6r)
- **_License_** -MIT License
