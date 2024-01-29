import type { SidebarConfig } from '@vuepress/theme-default';
import { commandCategories } from './command_categories';

export const sidebarRU: SidebarConfig = {
  '/ru/book/': [
    {
      text: 'Введение',
      link: '/ru/book/README.md',
      collapsible: false,
    },
    // {
    //   text: 'Начало работы',
    //   link: '/ru/book/getting_started.md',
    //   collapsible: false,
    //   children: [
    //     '/ru/book/installation.md',
    //     '/ru/book/default_shell.md',
    //     '/ru/book/quick_tour.md',
    //     '/ru/book/moving_around.md',
    //     '/ru/book/thinking_in_nu.md',
    //     '/ru/book/cheat_sheet.md',
    //   ],
    // },
    // {
    //   text: 'Основы Nu',
    //   link: '/nu_fundamentals.md',
    //   collapsible: false,
    //   children: [
    //     '/ru/book/types_of_data.md',
    //     '/ru/book/loading_data.md',
    //     '/ru/book/pipelines.md',
    //     '/ru/book/working_with_strings.md',
    //     '/ru/book/working_with_lists.md',
    //     '/ru/book/working_with_tables.md',
    //   ],
    // },
    // {
    //   text: 'Программирование в Nu',
    //   link: '/programming_in_nu.md',
    //   collapsible: false,
    //   children: [
    //     '/ru/book/custom_commands.md',
    //     '/ru/book/aliases.md',
    //     '/ru/book/operators.md',
    //     '/ru/book/variables_and_subexpressions.md',
    //     '/ru/book/control_flow.md',
    //     '/ru/book/scripts.md',
    //     '/ru/book/modules.md',
    //     '/ru/book/overlays.md',
    //     '/ru/book/command_signature.md',
    //     '/ru/book/testing.md',
    //     '/ru/book/style_guide.md',
    //   ],
    // },
    // {
    //   text: 'Nu как оболочка',
    //   link: '/nu_as_a_shell.md',
    //   collapsible: false,
    //   children: [
    //     '/ru/book/configuration.md',
    //     '/ru/book/environment.md',
    //     '/ru/book/stdout_stderr_exit_codes.md',
    //     '/ru/book/escaping.md',
    //     '/ru/book/3rdpartyprompts.md',
    //     '/ru/book/shells_in_shells.md',
    //     '/ru/book/line_editor.md',
    //     '/ru/book/externs.md',
    //     '/ru/book/custom_completions.md',
    //     '/ru/book/coloring_and_theming.md',
    //     '/ru/book/hooks.md',
    //     '/ru/book/background_task.md',
    //   ],
    // },
    // {
    //   text: 'Переход в Nu',
    //   link: '/coming_to_nu.md',
    //   collapsible: false,
    //   children: [
    //     '/ru/book/coming_from_bash.md',
    //     '/ru/book/coming_from_cmd.md',
    //     '/ru/book/nushell_map.md',
    //     '/ru/book/nushell_map_imperative.md',
    //     '/ru/book/nushell_map_functional.md',
    //     '/ru/book/nushell_operator_map.md',
    //   ],
    // },
    // {
    //   text: 'Примечания к дизайну',
    //   link: '/design_notes.md',
    //   collapsible: false,
    //   children: [
    //     '/ru/book/how_nushell_code_gets_run.md'
    //   ],
    // },
    // {
    //   text: '(Не очень) Продвинутый',
    //   link: '/advanced.md',
    //   collapsible: false,
    //   children: [
    //     '/ru/book/standard_library.md',
    //     '/ru/book/dataframes.md',
    //     '/ru/book/metadata.md',
    //     '/ru/book/creating_errors.md',
    //     '/ru/book/parallelism.md',
    //     '/ru/book/plugins.md',
    //     '/ru/book/explore.md',
    //   ],
    // },
  ],
};
