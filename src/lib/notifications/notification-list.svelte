<script>
  import { fly } from 'svelte/transition'
  import NotificationItem from './notification-item.svelte'
  import { notifications } from './notifications-store'
</script>

{#if $notifications}
  <div class="notification-list">
    {#each Object.entries($notifications) as [id, message] (id)}
      <div transition:fly={{ x: 400, duration: 200 }}>
        <NotificationItem {message} />
      </div>
    {/each}
  </div>
{/if}

<style>
  .notification-list {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;
    max-width: 100%;
    gap: 0.2rem;
    padding: 0.4rem;
  }
</style>
