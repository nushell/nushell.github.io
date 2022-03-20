# Command Reference

<script>
  export default {
    computed: {
      commands() {
        return this.$site.pages
          .filter(p => p.path.indexOf('/book/commands/') >= 0)
          .sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
      }
    }
  }
</script>

<table>
  <tr>
    <th>コマンド</th>
    <th>説明 </th>
  </tr>
  <tr v-for="command in commands">
   <td><a :href="command.path"><code>{{ command.title }}</code></a></td>
   <td style="white-space: pre-wrap;">{{ command.frontmatter.usage }}</td>
  </tr>
</table>
