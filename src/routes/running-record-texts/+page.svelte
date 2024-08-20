<script>
import Breadcrumbs from '$lib/breadcrumbs.svelte'
import TextAddForm from './text-add-form.svelte'
export let data
</script>

<Breadcrumbs crumbs={[{ name: 'Running record texts' }]} />

<h1>Running record texts</h1>

{#if data.runningRecordTexts?.length}
  <ul>
    {#each data.runningRecordTexts as runningRecordText}
      <li>
        <a href="/running-record-texts/{runningRecordText.id}"
          >{runningRecordText.title} {runningRecordText.lexile}L</a
        >
      </li>
    {/each}
  </ul>
{:else}
  <p>No running record texts yet.</p>
{/if}

<TextAddForm />
