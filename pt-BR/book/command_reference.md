# Command Reference

<table>
  <tr>
    <th>Command</th>
    <th>Description</th>
  </tr>
  <tr v-for="command in $site.pages.filter(p => p.path.indexOf('/book/commands/') >= 0)">
   <td><a :href="command.path"><code>{{ command.title }}</code></a></td>
   <td style="white-space: pre-wrap;">{{ command.frontmatter.usage }}</td>
  </tr>
</table>
