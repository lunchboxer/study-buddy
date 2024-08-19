<script>
import Alert from '$lib/alert.svelte'
export let errors = ''
const getMessage = errors => {
  if (!errors) {
    return false
  }
  return Array.isArray(errors)
    ? errors.map(error => error.message).join('\n')
    : errors?.message || errors
}
</script>

{#if getMessage(errors)}
  <Alert type="error" message={getMessage(errors)} />
{/if}
