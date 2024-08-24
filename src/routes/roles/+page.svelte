<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'

  export let data
</script>

<Breadcrumbs crumbs={[{ name: 'Roles' }]} />

<h1>Roles</h1>

{#if data.roles?.length > 0}
  <ul>
    {#each data.roles as role}
      <li>{role.name}</li>
    {/each}
  </ul>
{:else}
  <p>No roles found.</p>
{/if}

<h2>Create Role</h2>
<Form action="?/create" submitLabel="Add role" successMessage="Role created">
  <TextInput label="Name" name="name" required />
</Form>
