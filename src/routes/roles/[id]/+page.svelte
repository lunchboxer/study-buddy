<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  import DeleteModal from '$lib/delete-modal.svelte'
  import Select from '$lib/select.svelte'

  export let data

  $: options = data.otherUsers.map((user) => ({ label: user.username, value: user.id }))
</script>

<Breadcrumbs crumbs={[{ name: 'Roles', href: '/roles' }, { name: data.role.name }]} />

<h1>Role "{data.role.name}"</h1>

<h2>Users</h2>
{#if data.role.users?.length > 0}
  <ul>
    {#each data.role.users as user}
      <li><a href="/users/{user.id}">{user.username} ({user.name})</a></li>
    {/each}
  </ul>
{:else}
  <p>No users found.</p>
{/if}

<h3>Add role to user</h3>

<Form action="?/addUser" submitLabel="Add user" successMessage="Role added to user">
  <input type="hidden" name="role_id" value={data.role.id} />
  <Select {options} name="user_id" />
</Form>

<h2>Edit Role</h2>

<Form action="?/update" submitLabel="Update role" successMessage="Role updated">
  <input type="hidden" name="id" value={data.role.id} />
  <TextInput label="Name" name="name" value={data.role.name} required />
</Form>

<h2>Delete Role</h2>

<DeleteModal thingName="role" thing={data.role} />
