# Command Reference

<div v-for="command in $site.pages.filter(p => p.path.indexOf('/book/commands/') >= 0)">
   <h1><code>{{ command.title }}</code></h1>
   <Content :page-key="command.key"/>
</div>