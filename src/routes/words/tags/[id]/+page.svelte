<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  export let data
  console.log(data)
</script>

<Breadcrumbs
  crumbs={[
    { name: 'Words', href: '/words' },
    { name: 'Tags', href: '/words/tags' },
    { name: data.tag.name },
  ]}
/>

<h1>Word tag</h1>
