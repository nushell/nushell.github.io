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
      expressiveCode: {
        themes: [nushellTheme],
        shiki: {
          langs: [
            JSON.parse(
              fs.readFileSync("./public/nushell-grammar.json", "utf-8"),
            ),
          ],
        },
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
          label: "Start Here",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Introduction", link: "/introduction/" },
            { label: "Installation", link: "/book/installation/" },
            { label: "Default Shell", link: "/book/default_shell/" },
            { label: "Quick Tour", link: "/book/quick_tour/" },
            { label: "Moving Around", link: "/book/moving_around/" },
            { label: "Thinking in Nu", link: "/book/thinking_in_nu/" },
            { label: "Cheat Sheet", link: "/book/cheat_sheet/" },
          ],
        },
        {
          label: "Nu Fundamentals",
          items: [
            { label: "Data Types", link: "/book/types_of_data/" },
            { label: "Loading Data", link: "/book/loading_data" },
            { label: "Pipelines", link: "/book/pipelines/" },
            { label: "Strings", link: "/book/working_with_strings/" },
            { label: "Lists", link: "/book/working_with_lists/" },
            { label: "Tables", link: "/book/working_with_tables/" },
          ],
        },
        {
          label: "Programming in Nu",
          items: [
            { label: "Custom commands", link: "/book/custom_commands/" },
            { label: "Aliases", link: "/book/aliases/" },
            { label: "Operators", link: "/book/operators/" },
            {
              label: "Variables and Subexpressions",
              link: "/book/variables_and_subexpressions/",
            },
            { label: "Control Flow", link: "/book/control_flow/" },
            { label: "Scripts", link: "/book/scripts/" },
            { label: "Modules", link: "/book/modules/" },
            { label: "Overlays", link: "/book/overlays/" },
            { label: "Command signature", link: "/book/command_signatures/" },
            { label: "Testing", link: "/book/testing/" },
            { label: "Best Practices", link: "/book/style_guide/" },
          ],
        },
        {
          label: "Nu Shell",
          items: [
            { label: "Configuration", link: "/book/configuration/" },
            { label: "Environment", link: "/book/environment/" },
            {
              label: "Stout, Stderr, and Exit Codes",
              link: "/book/stdout_stderr_exit_codes/",
            },
            { label: "Escaping to the system", link: "/book/escaping/" },
            { label: "3rd party prompts", link: "/book/3rdpartyprompts/" },
            { label: "Shells in shells", link: "/book/shells_in_shells/" },
            {
              label: "Reedline (Nu's line editor)",
              link: "/book/line_editor/",
            },
            { label: "Externs", link: "/book/externs/" },
            { label: "Custom completions", link: "/book/custom_completions/" },
            {
              label: "Coloring and Theming",
              link: "/book/coloring_and_theming/",
            },
            { label: "Hooks", link: "/book/hooks/" },
            { label: "Background Tasks", link: "/book/background_task/" },
          ],
        },
        {
          label: "Coming to Nu from...",
          items: [
            { label: "Coming from Bash", link: "/book/coming_from_bash/" },
            { label: "Coming from CMD.EXE", link: "/book/coming_from_cmd/" },
            { label: "Nu Map", link: "/book/nushell_map/" },
            { label: "Nu Map", link: "/book/nushell_map_imperative/" },
            { label: "Nu Map", link: "/book/nushell_map_functional/" },
            { label: "Nu Map", link: "/book/nushell_operator_map/" },
          ],
        },
        {
          label: "(Not so) Advanced",
          items: [
            {
              label: "Standard Library",
              link: "/book/standard_library/",
              badge: { text: "Preview", variant: "caution" },
            },
            { label: "Dataframes", link: "/book/dataframes/" },
            { label: "Metadata", link: "/book/metadata/" },
            { label: "Errors", link: "/book/creating_errors/" },
            { label: "Parallelism", link: "/book/parallelism/" },
            { label: "Plugins", link: "/book/plugins/" },
            { label: "Explore", link: "/book/explore/" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
