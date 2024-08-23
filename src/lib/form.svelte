<script>
  import { enhance } from '$app/forms'
  import { notifications } from '$lib/notifications/notifications-store'
  import { goto, invalidateAll } from '$app/navigation'
  import Error from './error.svelte'

  export let submitLabel = 'Submit'
  export let resetLabel = 'Reset'
  export let method = 'post'
  export let successMessage = 'Form processed successfully'
  export let successUrl = ''
  export let action
  export let onReset = () => {}
  export let onSuccess = () => {}
  export let inline = false
  export let id = ''

  let formComponent
  let restart = 1
  let loading = false
  let errors = ''

  const reset = async () => {
    ++restart
    errors = ''
    formComponent.reset()
    formComponent.setAttribute('isValid', true)
    await invalidateAll()
    onReset()
  }

  const submitHandler = () => {
    errors = ''
    loading = true
    return async ({ result, update }) => {
      loading = false
      await update()
      if (result.type === 'failure') {
        notifications.add({
          type: 'error',
          text: 'Form submission failed. Please try again.',
        })
        if (result.data?.errors?.all) {
          errors = result.data.errors.all
        }
      } else if (result.type === 'success') {
        notifications.add({
          type: 'success',
          text: successMessage,
        })
        onSuccess()
        if (successUrl) {
          goto(successUrl)
          return
        }
        formComponent.reset()
        formComponent.setAttribute('isValid', true)
      }
    }
  }
</script>

<div class:inline class:container={!inline} class:max-w-md={!inline}>
  <Error {errors} />
  <form
    {method}
    class:inline
    use:enhance={submitHandler}
    {action}
    {id}
    on:reset|preventDefault={reset}
    bind:this={formComponent}
  >
    {#key restart}
      <slot />
    {/key}
    {#if !inline}
      <div class="button-group justify-end flex flex-wrap py-4">
        <slot name="buttons">
          <input class="btn grow" type="reset" value={resetLabel} />
          <button class="btn btn-primary grow" disabled={loading} type="submit">
            {#if loading}
              <span class="loading loading-spinner"></span>
              loading
            {:else}
              {submitLabel}
            {/if}
          </button>
        </slot>
      </div>
    {/if}
  </form>
</div>
