<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  import DeleteModal from '$lib/delete-modal.svelte'

  export let data
</script>

<Breadcrumbs crumbs={[{ name: 'Users', href: '/users' }, { name: data.user.username }]} />

<h1>Edit user</h1>

{#if !data.user}
  <p>User not found.</p>
{:else}
  <Form action="?/update" submitLabel="Update" successMessage="User updated" id="user-update-form">
    <input type="hidden" name="id" value={data.user.id} />
    <TextInput label="Username" name="username" required value={data.user.username} />
    <TextInput label="Name" name="name" required value={data.user.name} />
    <TextInput label="Email" name="email" value={data.user.email} />
  </Form>

  <h2>Update password</h2>

  <Form
    id="update-password-form"
    action="?/updatePassword"
    submitLabel="Update"
    successMessage="Password updated"
  >
    <input type="hidden" name="id" value={data.user.id} />
    <TextInput label="New password" name="password" type="password" required />
  </Form>

  <h2>Roles</h2>

  {#if data.user.roles?.length > 0}
    <ul>
      {#each data.user.roles as role}
        <li><a href="/roles/{role.id}">{role.name}</a></li>
      {/each}
    </ul>
  {:else}
    <p>No roles found.</p>
  {/if}

  <hr />
  <DeleteModal thing={data.user} thingName="user" />
{/if}
