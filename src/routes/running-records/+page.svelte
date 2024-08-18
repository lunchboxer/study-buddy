<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  export let data
</script>

<Breadcrumbs crumbs={[{ name: 'Running records' }]} />

<h1>Running records</h1>

{#if data.runningRecords?.length}
  <ul>
    {#each data.runningRecords as runningRecord}
      <li>
        <a href="/running-records/{runningRecord.id}">{runningRecord.id}</a>
      </li>
    {/each}
  </ul>
{:else}
  <p>No running records yet.</p>
{/if}
