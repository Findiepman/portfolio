"use strict";
// ─────────────────────────────────────────────────────────
// plugins.ts — Minecraft plugin library data
// Compiled to dist/plugins.js via tsc, loaded before app.js
// on minecraft.html only.
//
// HOW TO ADD A PLUGIN:
// Append one object to MC_PLUGINS below — that's it. app.ts
// renders a compact card for it in the "all plugins" grid and
// wires up the detail modal. The card can be deep-linked as
// minecraft#<slug>.
//
// Required: slug (unique, url-safe), name, description (short,
// shown on the card), technologies.
// Everything else is optional and only rendered when present.
// ─────────────────────────────────────────────────────────
const MC_PLUGINS = [
    {
        slug: "playershops",
        name: "Playershops",
        description: "Lets players create and stock their own shops, with holograms above each shop and a Discord transaction log.",
        longDescription: "The playershops plugin is an easy way to have your players create their own shops. It uses my hologram plugin to display the text above. It also features a transaction log which you can connect to your discord. It has the option to blacklist a world so you dont get your spawn world filled with shops. Players can add stock add items and admins can see every shop and its contents.",
        technologies: ["Java"],
        server: "FerruhSMP",
        tags: ["Economy", "SMP"],
        features: [
            "Players create and manage their own shops",
            "Hologram text above every shop, powered by my hologram plugin",
            "Transaction log with Discord integration",
            "World blacklist so your spawn world doesn't fill up with shops",
            "Admins can inspect every shop and its contents",
        ],
        links: {
            discord: "https://discord.gg/ferruhsmp",
        },
    },
    {
        slug: "claims",
        name: "Claims",
        description: "A claim plugin with per-member permissions, ranks and full environment settings for every claim.",
        longDescription: "This plugin does everything other claim plugins do but better. You can trust untrust, ban unban, promote demote players. It features a settings menu where you can edit everything everyone can do on your claim. You can edit every single member's permission. You can also edit environment settings like creeper explosions, fire spread and more!",
        technologies: ["Java"],
        server: "FerruhSMP",
        tags: ["Protection", "SMP"],
        features: [
            "Trust/untrust, ban/unban and promote/demote players",
            "Settings menu covering everything members can do on your claim",
            "Per-member permission editing",
            "Environment settings like creeper explosions and fire spread",
        ],
        links: {
            discord: "https://discord.gg/ferruhsmp",
        },
    },
    {
        slug: "gens",
        name: "Gens",
        description: "Upgradable generators with a genshop, virtual item stacking, sell wands and skript-ready placeholders.",
        longDescription: "This plugin was built for a gen server it features upgradable generators, a genshop virtual item stacking sell wands and more. You could stack generators shift + right click to instantly upgrade them. Sell your stash using /sell view your stash. It has a bunch of placeholders meaning you can use them to build stuff with them using skript.",
        technologies: ["Java", "Skript"],
        tags: ["Economy", "Gameplay"],
        features: [
            "Upgradable, stackable generators",
            "Shift + right click to instantly upgrade a generator",
            "Genshop and virtual item stacking",
            "Sell wands and /sell for your stash",
            "A bunch of placeholders so you can build on top of it with skript",
        ],
    },
    {
        slug: "boss-slayers",
        name: "Boss Slayers",
        description: "A full slayer system: level up your slayers, fight MythicMobs bosses and hunt rare drops from whole loot tables.",
        longDescription: "This skript is one of my favorites. A whole entire slayer system. It uses mythicmobs for the bosses and skript for everything else. You can level up your slayers to get some cool rewards. Drop rare drops from bosses which had entire loot tables. Each boss had its own OP pet you could drop. You could also drop their signature weapon",
        technologies: ["Skript"],
        server: "PrimalMines",
        tags: ["Gameplay", "Combat"],
        features: [
            "Slayer leveling with cool rewards",
            "Bosses built with MythicMobs, everything else in skript",
            "Entire loot tables with rare drops",
            "Every boss has its own OP pet you can drop",
            "Signature weapon drops per boss",
        ],
        extra: "Uses Mythic Mobs as a dependency for the boss mobs themselves.",
    },
    {
        slug: "forge",
        name: "Forge",
        description: "An addon to Boss Slayers — craft armor, weapons and pets from the shards each boss drops.",
        longDescription: "The forge was an addon to the slayers. Using the shards you drop from each boss you can craft armor weapons pets and more. It wasn't really optimised for speed though since you have to manually run a command to add an item to the forge. It worked fine though and i really like it!",
        technologies: ["Skript"],
        server: "PrimalMines",
        tags: ["Gameplay", "Crafting"],
        features: [
            "Craft armor, weapons, pets and more from boss shards",
            "Built as an addon on top of the Boss Slayers system",
        ],
        extra: "Not really optimised for speed — you add items to the forge manually with a command — but it works fine and i really like it!",
    },
];
//# sourceMappingURL=plugins.js.map