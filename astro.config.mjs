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
              label: "Start Here",
              translations: { pt: "Comece Aqui" },
              collapsed: true,
              items: [
                {
                  label: "Introduction",
                  link: "/introduction/",
                  translations: {
                    pt: "Introdução",
                    es: "Introducción",
                    "zh-CN": "介绍",
                  },
                },
                {
                  label: "Getting Started",
                  link: "/book/getting_started/",
                  translations: { pt: "Introdução" },
                },
                {
                  label: "Installation",
                  link: "/book/installation/",
                  translations: { "zh-CN": "安装 Nu" },
                },
                { label: "Default Shell", link: "/book/default_shell/" },
                { label: "Quick Tour", link: "/book/quick_tour/" },
                {
                  label: "Moving Around",
                  link: "/book/moving_around/",
                  translations: { "zh-CN": "在系统中四处移动" },
                },
                {
                  label: "Thinking in Nu",
                  link: "/book/thinking_in_nu/",
                  translations: { "zh-CN": "以 Nushell 的方式思考" },
                },
                { label: "Cheat Sheet", link: "/book/cheat_sheet/" },
              ],
            },
            {
              label: "Nu Fundamentals",
              collapsed: true,
              items: [
                {
                  label: "Data Types",
                  link: "/book/types_of_data/",
                  translations: {
                    pt: "Tipos de Dados",
                    es: "Tipos de Datos",
                    "zh-CN": "数据类型",
                  },
                },
                {
                  label: "Loading Data",
                  link: "/book/loading_data",
                  translations: {
                    pt: "Carregando Dados",
                    es: "Cargando datos",
                    "zh-CN": "加载数据",
                  },
                },
                {
                  label: "Pipelines",
                  link: "/book/pipelines/",
                  translations: { "zh-CN": "管道" },
                },
                {
                  label: "Strings",
                  link: "/book/working_with_strings/",
                  translations: { "zh-CN": "处理字符串" },
                },
                {
                  label: "Lists",
                  link: "/book/working_with_lists/",
                  translations: { "zh-CN": "处理列表" },
                },
                {
                  label: "Tables",
                  link: "/book/working_with_tables/",
                  translations: {
                    pt: "Tabelas",
                    es: "Tablas",
                    "zh-CN": "处理表格",
                  },
                },
              ],
            },
            {
              label: "Programming in Nu",
              collapsed: true,
              items: [
                {
                  label: "Custom commands",
                  link: "/book/custom_commands/",
                  translations: { "zh-CN": "自定义命令" },
                },
                {
                  label: "Aliases",
                  link: "/book/aliases/",
                  translations: { "zh-CN": "别名" },
                },
                {
                  label: "Operators",
                  link: "/book/operators/",
                  translations: { "zh-CN": "运算符" },
                },
                {
                  label: "Variables and Subexpressions",
                  link: "/book/variables_and_subexpressions/",
                  translations: {
                    es: "Variables y Subexpresiones",
                    "zh-CN": "变量和子表达式",
                  },
                },
                { label: "Control Flow", link: "/book/control_flow/" },
                {
                  label: "Scripts",
                  link: "/book/scripts/",
                  translations: { "zh-CN": "脚本" },
                },
                {
                  label: "Modules",
                  link: "/book/modules/",
                  translations: { "zh-CN": "模块" },
                },
                {
                  label: "Overlays",
                  link: "/book/overlays/",
                  translations: { "zh-CN": "覆层" },
                },
                {
                  label: "Command signature",
                  link: "/book/command_signature/",
                },
                { label: "Testing", link: "/book/testing/" },
                { label: "Best Practices", link: "/book/best_practices/" },
              ],
            },
            {
              label: "Nu Shell",
              items: [
                {
                  label: "Configuration",
                  link: "/book/configuration/",
                  translations: {
                    pt: "Configuração",
                    es: "Configuración",
                    "zh-CN": "配置",
                  },
                },
                {
                  label: "Environment",
                  link: "/book/environment/",
                  translations: {
                    pt: "Ambiente",
                    es: "Entorno",
                    "zh-CN": "环境",
                  },
                },
                {
                  label: "Stout, Stderr, and Exit Codes",
                  link: "/book/stdout_stderr_exit_codes/",
                  translations: {
                    "zh-CN": "标准输入、输出和退出码",
                  },
                },
                {
                  label: "Escaping to the system",
                  link: "/book/escaping/",
                  translations: {
                    pt: "Escapando para o sistema",
                    es: "Escapando al sistema",
                  },
                },
                { label: "3rd party prompts", link: "/book/3rdpartyprompts/" },
                {
                  label: "Shells in shells",
                  link: "/book/shells_in_shells/",
                  translations: {
                    pt: "Shells em shells",
                    es: "Shells en shells",
                  },
                },
                {
                  label: "Reedline (Nu's line editor)",
                  link: "/book/line_editor/",
                },
                { label: "Externs", link: "/book/externs/" },
                {
                  label: "Custom completions",
                  link: "/book/custom_completions/",
                },
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
                {
                  label: "Coming from Bash",
                  link: "/book/coming_from_bash/",
                  translations: {
                    pt: "Vindo do Bash",
                    es: "Llegando desde Bash",
                  },
                },
                {
                  label: "Coming from CMD.EXE",
                  link: "/book/coming_from_cmd/",
                },
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
                {
                  label: "Metadata",
                  link: "/book/metadata/",
                  translations: { pt: "Metadados", es: "Metadatos" },
                },
                { label: "Errors", link: "/book/creating_errors/" },
                { label: "Parallelism", link: "/book/parallelism/" },
                {
                  label: "Plugins",
                  link: "/book/plugins/",
                },
                {
                  label: "Explore",
                  link: "/book/explore/",
                  translations: { pt: "Explorar", es: "Explorar" },
                },
              ],
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
          items: [
            { label: "Introduction", link: "/introduction/" },
            { label: "Getting Started", link: "/book/getting_started/" },
          ],
        },
        {
          label: "Blog",
          link: "/blog/",
        },
      ],
    }),
  ],
});
