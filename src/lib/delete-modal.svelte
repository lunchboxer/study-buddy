<script>
  import Modal from '$lib/modal.svelte'
  import Form from '$lib/form.svelte'

  export let thing = {}
  export let thingName = '' // e.g. "student"
  export let name = thing?.name || thing?.title || `id ${thing?.id}`
  export let parentUrl = thingName ? `/${toKebabCase(thingName)}s` : '/' // e.g. "/students"

  let modal

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  function toKebabCase(string) {
    return string.replaceAll(/\s+/g, '-').toLowerCase()
  }

  const successMessage = `${capitalize(thingName)} ${name} deleted`
  const message = name
    ? `${capitalize(thingName)} "${name}" will be permanently deleted.`
    : `This ${thingName} will be permanently deleted.`
</script>

<button class="btn" on:click={() => modal.showModal()}>Delete {thingName}</button>

<Modal heading="Are you sure?" {message} bind:modal>
  <Form
    action="?/delete"
    successUrl={parentUrl}
    onReset={() => modal?.close()}
    resetLabel="Cancel"
    submitLabel="Yes, delete {thingName}"
    {successMessage}
    onSuccess={() => modal?.close()}
  >
    <input type="hidden" name="id" value={thing?.id} />
  </Form>
</Modal>
