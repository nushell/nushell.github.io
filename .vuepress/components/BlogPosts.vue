<template>
  <div>
    <div v-for="post in posts">
      <section class="blog-post">
        <time class="published">{{ post.date }}</time>
        <h2 class="title">
          <a v-bind:href="post.path" class="link">{{ post.title }}</a>
        </h2>
        <p v-if="post.frontmatter.excerpt" class="excerpt">
          {{ post.frontmatter.excerpt }}
        </p>
        <a class="read-more" v-bind:href="post.path"> Read More →</a>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlogPosts",
  computed: {
    posts() {
      return this.$site.pages
        .filter((p) => {
          return p.path.indexOf("/blog/") >= 0 && p.path != "/blog/";
        })
        .map((p) => {
          let path = p.path.replace("/blog/", "");
          return { ...p, path: path, date: path.substring(0, 10) };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },
  },
};
</script>

<style scoped>
.blog-post {
  margin-bottom: 2.5rem;
}
.excerpt {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.2rem;
}
.link {
  font-weight: 700;
  color: #2c3e50;
  &:hover {
    text-decoration: underline;
  }
}
.published {
  font-weight: 400;
}
.title {
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 24px;
}
.read-more {
  font-weight: 500;
  border: 1px solid #3eaf7c;
  border-radius: 4px;
  color: #3eaf7c;
  font-size: 0.9rem;
  padding: 0.3rem 0.6rem;
  box-shadow: 0 0;
  display: inline-block;
}
</style>
