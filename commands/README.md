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
  </tr>
  <tr v-for="command in commands">
   <td><a :href="command.path">{{ command.title }}</a></td>
   <td style="white-space: pre-wrap;">{{ command.frontmatter.categories }}</td>
   <td style="white-space: pre-wrap;">{{ command.frontmatter.usage }}</td>
  </tr>
</table>
