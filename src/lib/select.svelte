<script>
import { page } from '$app/stores'
import { toSnakeCase } from '$lib/utils'

export let label = ''
export let name = ''
export let description = ''
export let selected = ''

const id = name || toSnakeCase(label)
const descriptionId = `description-${id}`

export let required = false
export let error = ''
export let data = {}
export let value = $page?.form?.[id] ?? data?.[id] ?? ''
export let options = []
</script>

<label for={id} class="form-control w-full max-w-md mb-4">
  <div class="label">
    <span class="label-text">{label}</span>
    <span class="label-text-alt error-text">{$page?.form?.errors?.[id] || error}</span>
  </div>
  <select
    name={id}
    {id}
    {required}
    class="select select-bordered"
    value={$page?.form?.[id] ?? data?.[id] ?? selected ?? value}
    class:select-error={$page?.form?.errors?.[id] || error}
    aria-invalid={$page?.form?.errors?.[id] || error ? 'true' : undefined}
  >
    {#each options as { label, value }}
      <option {value}>{label}</option>
    {/each}
  </select>

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
