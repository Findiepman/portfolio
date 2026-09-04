interface McPluginLinks {
    github?: string;
    discord?: string;
    spigot?: string;
    modrinth?: string;
}
interface McPlugin {
    /** Unique url-safe id — the plugin becomes linkable as minecraft#<slug> */
    slug: string;
    name: string;
    /** Short blurb for the compact card (roughly one or two sentences) */
    description: string;
    /** Full story for the modal; one string or an array of paragraphs. Falls back to description. */
    longDescription?: string | string[];
    /** e.g. ["Java"] or ["Skript", "Skbee"] — shown as the card's meta line */
    technologies: string[];
    /** e.g. "Paper" — appended to the meta line when set */
    platform?: string;
    /** Server the plugin was built for, shown as a tag in the modal */
    server?: string;
    /** Free-form category tags, e.g. ["Economy", "Gameplay"] */
    tags?: string[];
    /** Small square icon shown on the card */
    icon?: string;
    /** Banner image/GIF shown at the top of the modal */
    image?: string;
    /** Bullet list for the modal's "features" section */
    features?: string[];
    /** Extra paragraph for the modal's "good to know" section */
    extra?: string;
    links?: McPluginLinks;
}
declare const MC_PLUGINS: McPlugin[];
//# sourceMappingURL=plugins.d.ts.map