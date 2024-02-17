---
title: Befehlsreferenz
---

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
    <th>Beschreibung</th>
  </tr>
  <tr v-for="command in commands">
   <td><a :href="command.path"><code>{{ command.title }}</code></a></td>
   <td style="white-space: pre-wrap;">{{ command.frontmatter.usage }}</td>
  </tr>
</table>
