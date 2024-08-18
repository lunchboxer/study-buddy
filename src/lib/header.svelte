<script>
  import HamburgerIcon from '$lib/icons/hamburger-icon.svelte'
  import CloseIcon from '$lib/icons/close-icon.svelte'
  import BookIcon from '$lib/icons/book-icon.svelte'
  export let me
  export let checked
</script>

<header class="navbar w-full lg:hidden bg-base-200 z-50 shadow-sm">
  <div class="navbar-start">
    {#if me?.id}
      <label
        class="btn btn-circle btn-ghost lg:hidden swap swap-rotate"
        for="drawer"
        aria-label="open sidebar"
      >
        <!-- this hidden checkbox controls the state -->
        <input type="checkbox" id="hidden-sidebar-trigger" bind:checked />

        <HamburgerIcon size="24" />
        <CloseIcon size="24" />
      </label>
    {/if}
  </div>
  <div class="navbar-center">
    <a href="/" class="btn btn-ghost text-primary text-xl lg:hidden">
      <BookIcon size="18" />
      Study Buddy
    </a>
  </div>
  <div class="navbar-end"></div>
</header>
