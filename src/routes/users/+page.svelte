<script>
  export let data
</script>

<h1>Users</h1>

{#if data.users?.length !== 0}
  {#each data.users as user}
    <div>{user.username}</div>
  {/each}
{/if}
