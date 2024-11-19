<script>
  export let data
</script>

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
          <td>{tag.order_index || '--'}</td>
          <td>{tag.parent_tag_name || '--'}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
