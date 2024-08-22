<script>
  import EyeIcon from '$lib/icons/eye-icon.svelte'
  import EyeOffIcon from '$lib/icons/eye-off-icon.svelte'
  import { page } from '$app/stores'
  import { toSnakeCase } from '$lib/utils'

  export let label = ''
  export let name = ''
  export let description = ''
  export let min
  export let max

  const id = name || toSnakeCase(label)
  const descriptionId = `description-${id}`

  export let required = false
  export let error = ''
  export let type = 'text'
  export let constraints = {}
  export let autocomplete = 'off'
  export let data = {}
  export let value = $page?.form?.[id] ?? data?.[id] ?? ''

  let showPassword = false

  function showHidePassword() {
    showPassword = !showPassword
  }
</script>

<label for={id} class="form-control w-full max-w-md mb-4">
  <div class="label">
    <span class="label-text">{label}</span>
    <span class="label-text-alt error-text">{$page?.form?.errors?.[id] || error}</span>
  </div>
  {#if type === 'password'}
    <div
      class="input input-bordered flex items-center gap-2"
      class:input-error={$page?.form?.errors?.[id] || error}
    >
      {#if showPassword}
        <input
          {id}
          {autocomplete}
          name={id}
          type="text"
          class="grow"
          {required}
          bind:value
          aria-invalid={$page?.form?.errors?.[id] || error ? 'true' : undefined}
          {...constraints}
        />
      {:else}
        <input
          {id}
          name={id}
          {autocomplete}
          class="grow"
          type="password"
          {required}
          bind:value
          aria-invalid={$page?.form?.errors?.[id] || error ? 'true' : undefined}
          {...constraints}
        />
      {/if}

      <span
        tabindex="0"
        role="switch"
        aria-checked={showPassword}
        aria-describedby="password"
        class="reset"
        on:click={showHidePassword}
        on:keydown={(event) => event.key === 'Enter' && showHidePassword()}
      >
        {#if showPassword}
          <EyeOffIcon />
        {:else}
          <EyeIcon />
        {/if}
      </span>
    </div>
  {:else}
    <input
      name={id}
      {id}
      {autocomplete}
      {type}
      {min}
      {max}
      {required}
      class="input input-bordered w-full"
      value={$page?.form?.[id] ?? data?.[id] ?? value}
      class:input-error={$page?.form?.errors?.[id] || error}
      aria-invalid={$page?.form?.errors?.[id] || error ? 'true' : undefined}
      {...constraints}
    />
  {/if}

  {#if description}
    <label class="label" for={name}>
      <span class="label-text-alt help-text" id={descriptionId}>
        {description}
      </span>
    </label>
  {/if}
</label>

<style>
  .error-text {
    color: oklch(var(--er));
  }
  .help-text {
    color: oklch(var(--in));
  }
</style>
