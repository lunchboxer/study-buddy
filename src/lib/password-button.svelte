<script>
  import Fa from 'svelte-fa'

  export let icon
  export let text
  export let password = []
</script>

<button
  on:click
  class="btn m-4 btn-square btn-lg"
  class:btn-active={password.includes(text)}
  class:btn-primary={password.includes(text)}
>
  <Fa {icon} size="2x" />
</button>
