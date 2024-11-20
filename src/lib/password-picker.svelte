<script>
  import PasswordButton from '$lib/password-button.svelte'
  import { passwordIconMap } from '$lib/constants'

  export let password = []

  function handleSelection(text) {
    password = password.includes(text)
      ? password.filter((item) => item !== text)
      : [...password, text].sort((a, b) => a.localeCompare(b))
  }
</script>

<div class="grid grid-cols-4 gap-2 my-4">
  {#each passwordIconMap as { icon, text }}
    <PasswordButton on:click={() => handleSelection(text)} {icon} {text} {password} />
  {/each}
</div>
