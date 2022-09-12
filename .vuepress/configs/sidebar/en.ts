import type { SidebarConfig } from '@vuepress/theme-default';

function getSideBarConfig(version) {
  const prefix = version === 'latest' ? '/book' : `/book/${version}`;
  return [
    {
      text: 'Introduction',
      link: `${prefix}/README.md`,
      collapsible: false,
    },
    {
      text: 'Getting Started',
      link: `${prefix}/getting_started.md`,
      collapsible: false,
      children: [
        `${prefix}/installation.md`,
        `${prefix}/quick_tour.md`,
        `${prefix}/moving_around.md`,
        `${prefix}/thinking_in_nu.md`,
      ],
    },
    {
      text: 'Nu Fundamentals',
      link: `${prefix}/nu_fundamentals.md`,
      collapsible: false,
      children: [
        `${prefix}/types_of_data.md`,
        `${prefix}/loading_data.md`,
        `${prefix}/pipelines.md`,
        `${prefix}/working_with_strings.md`,
        `${prefix}/working_with_lists.md`,
        `${prefix}/working_with_tables.md`,
        `${prefix}/command_reference.md`,
      ],
    },
    {
      text: 'Programming in Nu',
      link: `${prefix}/programming_in_nu.md`,
      collapsible: false,
      children: [
        `${prefix}/custom_commands.md`,
        `${prefix}/aliases.md`,
        `${prefix}/operators.md`,
        `${prefix}/variables_and_subexpressions.md`,
        `${prefix}/scripts.md`,
        `${prefix}/modules.md`,
        `${prefix}/overlays.md`,
      ],
    },
    {
      text: 'Nu as a Shell',
      link: `${prefix}/nu_as_a_shell.md`,
      collapsible: false,
      children: [
        `${prefix}/configuration.md`,
        `${prefix}/environment.md`,
        `${prefix}/stdout_stderr_exit_codes.md`,
        `${prefix}/escaping.md`,
        `${prefix}/3rdpartyprompts.md`,
        `${prefix}/shells_in_shells.md`,
        `${prefix}/line_editor.md`,
        `${prefix}/externs.md`,
        `${prefix}/custom_completions.md`,
        `${prefix}/coloring_and_theming.md`,
        `${prefix}/hooks.md`,
      ],
    },
    {
      text: 'Coming to Nu',
      link: `${prefix}/coming_to_nu.md`,
      collapsible: false,
      children: [
        `${prefix}/coming_from_bash.md`,
        `${prefix}/coming_from_cmd.md`,
        `${prefix}/nushell_map.md`,
        `${prefix}/nushell_map_imperative.md`,
        `${prefix}/nushell_map_functional.md`,
        `${prefix}/nushell_operator_map.md`,
      ],
    },
    {
      text: '(Not So) Advanced',
      link: `${prefix}/advanced.md`,
      collapsible: false,
      children: [
        `${prefix}/dataframes.md`,
        `${prefix}/metadata.md`,
        `${prefix}/creating_errors.md`,
        `${prefix}/parallelism.md`,
        `${prefix}/plugins.md`,
      ],
    },
  ];
}

export const sidebarEn: SidebarConfig = {
  '/book/': getSideBarConfig('latest'),
  '/book/v0.68.x/': getSideBarConfig('v0.68.x'),
  // "/contributor-book/": [
  //   {
  //     text: "Contributor Book",
  //     collapsible: false,
  //     children: [
  //       "",
  //       "philosophy",
  //       "values",
  //       "commands",
  //       "streams",
  //       "metadata",
  //       "plugins",
  //       "shells",
  //     ],
  //   },
  // ],
  '/cookbook/': [
    {
      text: 'Cookbook',
      collapsible: false,
      children: [
        'README.md',
        'setup',
        'help',
        'system',
        'parsing',
        'native_shell_programs',
        'files',
        'git',
        'parsing_git_log',
        'http',
        'direnv',
        'misc',
        'tables',
      ],
    },
  ],
};
