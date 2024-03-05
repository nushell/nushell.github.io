import fs from "node:fs";
import starlight from "@astrojs/starlight";
import { ExpressiveCodeTheme } from "@astrojs/starlight/expressive-code";
import { defineConfig } from "astro/config";

const jsoncString = fs.readFileSync(
  new URL("./public/nushell_minimal_dark_theme.json", import.meta.url),
  "utf-8",
);
const nushellTheme = ExpressiveCodeTheme.fromJSONString(jsoncString);

// https://astro.build/config
export default defineConfig({
  site: "https://www.nushell.sh/",
  integrations: [
    starlight({
      title: "Nushell Docs",
      defaultLocale: "root",
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
        "zh-cn": {
          label: "简体中文",
          lang: "zh-CN",
        },
        es: {
          label: "Español",
        },
        ja: {
          label: "日本語",
        },
        pt: {
          label: "Português",
        },
        ru: {
          label: "Русский",
        },
        de: {
          label: "Deutsch",
        },
      },
      expressiveCode: {
        themes: [nushellTheme],
      },
      editLink: {
        baseUrl: "https://github.com/nushell/nushell.github.io/edit/master/",
      },
      customCss: ["./src/styles/index.css"],
      logo: {
        src: "./src/assets/images/nu_icon.png",
      },
      social: {
        github: "https://github.com/nushell/nushell",
        discord: "https://discord.gg/NtAbbGn",
      },
      sidebar: [
        {
          label: "Book",
          collapsed: true,
          items: [
            {
              label: "Getting Started",
              translations: { pt: "Comece Aqui" },
              collapsed: true,
              autogenerate: { directory: "/book/getting-started" },
            },
            {
              label: "Nu Fundamentals",
              collapsed: true,
              autogenerate: { directory: "/book/nu-fundamentals" },
            },
            {
              label: "Programming in Nu",
              collapsed: true,
              autogenerate: { directory: "/book/programming-in-nu" },
            },
            {
              label: "Nu as a Shell",
              collapsed: true,
              autogenerate: { directory: "/book/nu-as-a-shell" },
            },
            {
              label: "Coming to Nu",
              collapsed: true,
              autogenerate: { directory: "/book/coming-to-nu" },
            },
            {
              label: "(Not so) Advanced",
              collapsed: true,
              autogenerate: { directory: "/book/advanced" },
            },
          ],
        },
        {
          label: "Command Reference",
          collapsed: true,
          link: "/commands/",
        },
        {
          label: "Cookbook",
          collapsed: true,
          autogenerate: { directory: "/cookbook/" },
        },
        {
          label: "Blog",
          link: "/blog/",
        },
      ],
    }),
  ],
});
