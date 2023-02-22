# filters

<script>
  import pages from '@temp/pages'
  export default {
    computed: {
      commands() {
        return pages
          .filter(p => p.path.includes('/commands/docs/'))
          .filter(p => p.frontmatter.categories.includes('filters'))
          .sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
      }
    }
  }
</script>

<table>
  <tr>
    <th>Command</th>
    <th>Description</th>
  </tr>
  <tr v-for="command in commands">
   <td><a :href="command.path">{{ command.title }}</a></td>
   <td style="white-space: pre-wrap;">{{ command.frontmatter.usage }}</td>
  </tr>
</table>
