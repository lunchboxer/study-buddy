<script>
import Breadcrumbs from '$lib/breadcrumbs.svelte'
import Select from '$lib/select.svelte'

export let data
const studentOptions = data.students.map(s => ({
  label: `${s.name} (${s.group_name})`,
  value: s.id,
}))

const textOptions = data.texts.map(t => ({
  label: `${t.title} (${t.lexile}L)`,
  value: t.id,
}))

let studentId = ''
let textId = ''
</script>

<Breadcrumbs crumbs={[{ name: 'Running records' }]} />

<h1>Running records</h1>

<h2>Add running record</h2>

<label for="studentId" class="form-control w-full max-w-md mb-4">
  <div class="label">
    <span class="label-text">Student</span>
  </div>
  <select name="studentId" class="select select-bordered" bind:value={studentId}>
    {#each studentOptions as { label, value }}
      <option {value}>{label}</option>
    {/each}
  </select>
</label>

<label for="textId" class="form-control w-full max-w-md mb-4">
  <div class="label">
    <span class="label-text">Text</span>
  </div>
  <select name="textId" class="select select-bordered" bind:value={textId}>
    {#each textOptions as { label, value }}
      <option {value}>{label}</option>
    {/each}
  </select>
</label>

<a class="btn btn-primary" href="/running-records/add?studentId={studentId}&textId={textId}"
  >Start new running record</a
>

<h2>Previous running records</h2>

{#if data.runningRecords?.length}
  <ul>
    {#each data.runningRecords as runningRecord}
      <li>
        <a href="/running-records/{runningRecord.id}">
          {runningRecord.id} - {runningRecord.created}
        </a>
      </li>
    {/each}
  </ul>
{:else}
  <p>No running records yet.</p>
{/if}
