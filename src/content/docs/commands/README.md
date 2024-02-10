---
title: Introducing nushell
author: Jonathan Turner
author_site: https://twitter.com/jntrnr
author_image: https://www.nushell.sh/blog/images/jonathandturner.jpg
excerpt: Today, we're introducing a new shell, written in Rust. It draws inspiration from the classic Unix philosophy of pipelines, the structured data approach of PowerShell, functional programming, systems programming, and more.
---

# Command Reference

If you're new to Nushell, [the quick tour](/book/quick_tour.md) can show you the most important commands. You don't need to know them all!

To see all commands from inside Nushell, run [`help commands`](/commands/docs/help.md).

<script>
  import pages from '@temp/pages'
  export default {
    computed: {
      commands() {
        return pages
          .filter(p => p.path.indexOf('/commands/docs/') >= 0)
          .sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
      }
    }
  }
</script>

<table>
  <tr>
    <th>Command</th>
    <th>Categories</th>
    <th>Description</th>
    <th>Feature</th>
  </tr>
  <tr v-for="command in commands">
   <td><a :href="command.path">{{ command.title }}</a></td>
   <td style="white-space: pre-wrap;">{{ command.frontmatter.categories }}</td>
   <td style="white-space: pre-wrap;">{{ command.frontmatter.usage }}</td>
   <td style="white-space: pre-wrap;">{{ command.frontmatter.feature }}</td>
  </tr>
</table>
