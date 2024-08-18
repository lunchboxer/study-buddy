<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import SubjectAddForm from './subject-add-form.svelte'
  export let data
</script>

<Breadcrumbs crumbs={[{ name: 'Subjects' }]} />

<h1>Subjects</h1>

{#if data.subjects?.length}
  <ul>
    {#each data.subjects as subject}
      <li>
        <a href="/subjects/{subject.id}">{subject.name}</a>
      </li>
    {/each}
  </ul>
{:else}
  <p>No subjects yet.</p>
{/if}

<hr />

<SubjectAddForm />
