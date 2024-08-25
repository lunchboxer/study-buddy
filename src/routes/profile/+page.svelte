<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  export let data
</script>

<Breadcrumbs crumbs={[{ name: 'Profile' }]} />

{#if data.me}
  <h1>User Profile</h1>

  <table>
    <thead>
      <tr>
        <th>Property</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Username</td>
        <td>{data.me.username}</td>
      </tr>
      <tr>
        <td>Name</td>
        <td>{data.me.name || '-'}</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>{data.me.email || '-'}</td>
      </tr>
      <tr>
        <td>Roles</td>
        <td>
          {data.me.roles?.join(', ') || '-'}
        </td>
      </tr>
    </tbody>
  </table>
{/if}
