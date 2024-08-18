<script>
  import InfoIcon from '$lib/icons/info-icon.svelte'
  import SuccessIcon from '$lib/icons/success-icon.svelte'
  import WarningIcon from '$lib/icons/warning-icon.svelte'

  export let type = 'info'
  export let message = ''
  export let toast = false
</script>

<div
  role="alert"
  class="alert flex my-2 py-2 px-4 shadow-sm"
  class:my-0={toast}
  class:alert-error={type === 'error'}
  class:alert-success={type === 'success'}
  class:alert-info={type === 'info'}
  class:alert-warning={type === 'warning'}
>
  {#if type === 'error'}
    <WarningIcon />
  {:else if type === 'success'}
    <SuccessIcon />
  {:else if type === 'info'}
    <InfoIcon />
  {:else if type === 'warning'}
    <WarningIcon />
  {/if}
  <span>{message}</span>
</div>
