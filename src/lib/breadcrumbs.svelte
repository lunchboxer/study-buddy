<script>
  export let crumbs = []
</script>

<nav class="breadcrumbs text-sm pb-8" aria-label="Breadcrumb">
  <ul class="m-0 p-0">
    <li>
      <a href="/">Home</a>
    </li>
    {#each crumbs as crumb, index}
      <li>
        {#if index < crumbs.length - 1}
          <a href={crumb.href}>{crumb.name}</a>
        {:else}
          <span>{crumb.name}</span>
        {/if}
      </li>
    {/each}
  </ul>
</nav>

<style>
  a {
    text-decoration: none;
  }
</style>
