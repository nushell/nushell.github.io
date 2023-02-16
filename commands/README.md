# Command Reference

Nushell provides commands for a variety of use cases.
You can find the included categories in the sidebar.

To see all commands in Nushell, run [`help commands`](../book/commands/help.md).

<script>
  import pages from '@temp/pages'
  export default {
    computed: {
      commands() {
        return pages
          .filter(p => p.path.indexOf('/book/commands/') >= 0)
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
