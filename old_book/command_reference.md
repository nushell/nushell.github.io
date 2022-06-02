# Command Reference

<script>
  import pages from '@temp/pages'
  export default {
    computed: {
      commands() {
        return pages
          .filter(p => p.path.indexOf('/commands/') >= 0)
          .sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
      }
    }
  }
</script>

<div v-for="command in commands">
   <h1><code>{{ command.title }}</code></h1>
   <Content :page-key="command.key"/>
</div>
