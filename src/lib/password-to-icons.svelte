<script>
  import { passwordIconMap } from '$lib/constants'
  import Fa from 'svelte-fa'

  export let password = ''

  $: passwordArray = password.split(',')
</script>

<div class="flex items-center gap-4">
  {#each passwordArray as word}
    {#each passwordIconMap as { icon, text }}
      {#if word === text}
        <Fa {icon} size="2x" />
      {/if}
    {/each}
  {/each}
</div>
