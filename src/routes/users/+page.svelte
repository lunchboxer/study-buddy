<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  export let data
</script>

<Breadcrumbs crumbs={[{ name: 'Users' }]} />

<h1>Users</h1>

{#if data.users?.length !== 0}
  <div class="overflow-x-auto w-full">
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>Username</th>
          <th>Name</th>
          <th>Roles</th>
          <th>Email</th>
        </tr>
      </thead>
      {#each data.users as user}
        <tr>
          <td><a href="/users/{user.id}">{user.username}</a></td>
          <td>{user.name}</td>
          <td>{user.roles || '-'}</td>
          <td>{user.email || '-'}</td>
        </tr>
      {/each}
    </table>
  </div>
{/if}

<h2>Add a new user</h2>

<Form action="?/create" submitLabel="Add" successMessage="User created" id="create-user-form">
  <TextInput label="Username" name="username" required />
  <TextInput label="Password" name="password" required type="password" />
  <TextInput label="Name" name="name" required />
  <TextInput label="Email" name="email" />
</Form>
