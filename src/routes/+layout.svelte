<script>
  import '../app.css'
  import Header from '$lib/header.svelte'
  import Footer from '$lib/footer.svelte'
  import SidebarNav from '$lib/sidebar-nav.svelte'
  import NotificationList from '$lib/notifications/notification-list.svelte'
  import LogoutModal from '$lib/logout-modal.svelte'
  import { theme, themeSwitcher } from '$lib/theme-switcher.svelte'
  import { page } from '$app/stores'

  export let data
  let logoutModal
  let checked = ''

  $: themeSwitcher($theme)
</script>

<svelte:head>
  <title>Study Buddy</title>
</svelte:head>

<div class="drawer lg:drawer-open">
  <input id="drawer" type="checkbox" class="drawer-toggle" bind:checked />
  <div class="drawer-content flex min-h-screen flex-col">
    {#if $page?.url?.pathname !== '/login' && $page?.url?.pathname !== '/register' && $page?.url?.pathname !== '/s'}
      <Header me={data.me} bind:checked />
    {/if}
    <main class="flex-grow mt-16 lg:mt-0 flex flex-col p-4 prose max-w-none md:px-16">
      <div class="flex-grow">
        <slot />
      </div>
    </main>
    <Footer />
    <NotificationList />
    <LogoutModal bind:modal={logoutModal} />
  </div>
  {#if data?.me?.id && $page?.url?.pathname !== '/s'}
    <div class="drawer-side z-40">
      <label for="drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <aside class="w-60 min-h-screen bg-base-300 shadow-sm">
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <ul
          on:click={() => (checked = '')}
          on:keydown={(event) => {
            if (event.key === 'Escape') {
              checked = ''
            }
          }}
          class="menu p-4 pt-20 m-0 lg:pt-4 fixed w-60 bg-base-300"
        >
          <SidebarNav me={data.me} {logoutModal} />
        </ul>
      </aside>
    </div>
  {/if}
</div>
