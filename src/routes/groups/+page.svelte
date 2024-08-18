<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import GroupAddForm from './group-add-form.svelte'

  export let data
  $: groups = data?.groups
</script>

<Breadcrumbs crumbs={[{ name: 'Groups' }]} />

<h1>Groups</h1>

{#if groups?.length}
  <ul>
    {#each groups as group}
      <li>
        <a href="/groups/{group.id}">{group.name}</a>
      </li>
    {/each}
  </ul>
{:else}
  <p>No groups yet.</p>
{/if}

<GroupAddForm activeSchoolYearId={data.me.active_school_year} />
