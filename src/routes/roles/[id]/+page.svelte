<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import Form from '$lib/form.svelte'
  import { invalidateAll } from '$app/navigation'
  import TextInput from '$lib/text-input.svelte'
  import DeleteModal from '$lib/delete-modal.svelte'
  import Select from '$lib/select.svelte'
  import MinusIcon from '$lib/icons/minus-icon.svelte'
  import { notifications } from '$lib/notifications/notifications-store'

  export let data

  $: options = data.otherUsers.map((user) => ({ label: user.username, value: user.id }))

  const removeRoleFromUser = async (userId) => {
    const result = await fetch(`/roles/${data.role.id}/remove-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, role_id: data.role.id }),
    })
    if (result.ok) {
      notifications.add({
        type: 'success',
        text: 'Role removed from user',
      })
      data.role.users = data.role.users.filter((user) => user.id !== userId)
      invalidateAll()
    } else {
      notifications.add({
        type: 'error',
        text: 'Could not remove role from user',
      })
    }
  }
</script>

<Breadcrumbs crumbs={[{ name: 'Roles', href: '/roles' }, { name: data.role.name }]} />

<h1>Role "{data.role.name}"</h1>

<h2>Users</h2>
{#if data.role.users?.length > 0}
  <ul>
    {#each data.role.users as user}
      <li>
        <a href="/users/{user.id}">{user.username} ({user.name})</a>
        <div class="tooltip" data-tip="Remove role from user">
          <button
            on:click={() => {
              removeRoleFromUser(user.id)
            }}
            class="btn btn-xs"
          >
            <MinusIcon />
          </button>
        </div>
      </li>
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
