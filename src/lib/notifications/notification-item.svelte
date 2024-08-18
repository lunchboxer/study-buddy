<script>
  import Alert from '$lib/alert.svelte'
  export let message

  $: text = !message || typeof message === 'string' ? message : message.text
  $: type = !message || typeof message === 'string' ? 'info' : message.type
</script>

<Alert {type} message={text} toast="true" />
