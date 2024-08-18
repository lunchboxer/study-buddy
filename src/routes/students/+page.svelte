<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import StudentAddForm from './student-add-form.svelte'

  export let data
</script>

<Breadcrumbs crumbs={[{ name: 'Students' }]} />

<h1>Students</h1>

{#if data.students?.length}
  <ul>
    {#each data.students as student}
      <li>
        <a href="/students/{student.id}">{student.name}</a>
      </li>
    {/each}
  </ul>
{:else}
  <p>No students yet.</p>
{/if}

<StudentAddForm />
