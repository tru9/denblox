<h1 align="center">
    <img src="./denblox.png" alt="denblox" width="450"/>
    <br>
</h1>

<h3 align="center">An easy to operate Roblox API Library for Deno<h3 align="center">
<p align="center">
    <a href='https://github.com/tru9/denblox'><img src="https://img.shields.io/github/languages/code-size/tru9/denblox?color=7EC27E&style=for-the-badge" alt="Github Code Size"/></a>
    <a href="https://github.com/tru9/denblox/issues"><img src="https://img.shields.io/github/issues/tru9/denblox?color=7EC27E&style=for-the-badge" alt="Github Issues"/></a>
    <a href="https://github.com/tru9/denblox/blob/master/LICENSE"><img src="https://img.shields.io/github/license/tru9/denblox?color=7EC27E&style=for-the-badge" alt="Github License"/>
        <a href="https://deno.land/x/denblox"><img src="https://img.shields.io/badge/package-denblox-7EC27E?style=for-the-badge"/></a>
</p>

<h1 align="center">
About
<br>
</h1>

<p align="center">
Denblox is a free and open-source Roblox API (Application programming interface) Library. Denblox was created to make supporting ROBLOX simpler without the need to create your own API Wrapper. This Library has a variety of functions that give you more Roblox access.
</p>

# Constructing

---

### Example

Run this in your terminal to see a quick example of denblox. After that,
you'll be asked to input a Roblox username.

```js
deno run --allow-net https://deno.land/x/denblox/example.ts
```

### Importing

You can import denblox using the mod.ts file; if you need anything else, you can do so also at the file directory.
[package](https://deno.land/x/denblox/mod.ts).

**_Requirements_**

- Deno Installed

```js
import * as denblox from "https://deno.land/x/denblox/mod.ts";
```

### Example

This is a self-explanatory header, but it shows you some fundamentals and how to use one of the library functions.

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
- **_Socials_** - 
  - Github - [tru9](https://github.com/tru9/)  
  - Twitter - [tru9](https://twitter.com/tru9_) 
  - Support Server - [Discord](https://discord.gg/F5xuN4aV6r)
- **_License_** -MIT License
