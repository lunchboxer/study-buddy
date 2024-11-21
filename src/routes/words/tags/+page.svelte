<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import AddWordTag from '$lib/add-word-tag.svelte'

  export let data
</script>

<Breadcrumbs crumbs={[{ name: 'words', href: '/words' }, { name: 'tags' }]} />

<h1>Word tags</h1>

<p>There are {data.tags?.length} tags in the database.</p>

{#if data.tags?.length}
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Word count</th>
        <th>Order index</th>
        <th>Parent tag</th>
      </tr>
    </thead>
    <tbody>
      {#each data.tags as tag}
        <tr>
          <td><a href="/words/tags/{tag.id}">{tag.name}</a></td>
          <td>{tag.word_count}</td>
          <td>{tag.order_index}</td>
          <td>{tag.parent_tag_name || '--'}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<h2>Add tag</h2>

<AddWordTag />
