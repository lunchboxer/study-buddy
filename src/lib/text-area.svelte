<script>
  import { page } from '$app/stores'
  import { toSnakeCase } from '$lib/utils'

  export let label = ''
  export let name = ''
  export let description = ''
  export let selected = ''
  export let rows = 4

  const id = name || toSnakeCase(label)
  const descriptionId = `description-${id}`

  export let required = false
  export let error = ''
  export let data = {}
  export let value = $page?.form?.[id] ?? data?.[id] ?? ''
</script>

<label for={id} class="form-control w-full max-w-md mb-4">
  <div class="label">
    <span class="label-text">{label}</span>
    <span class="label-text-alt text-error">{$page?.form?.errors?.[id] || error}</span>
  </div>
  <textarea
    name={name === 'nosend' ? '' : id}
    {id}
    {required}
    {rows}
    class="textarea textarea-bordered"
    value={$page?.form?.[id] ?? data?.[id] ?? selected ?? value}
    class:textarea-error={$page?.form?.errors?.[id] || error}
    aria-invalid={$page?.form?.errors?.[id] || error ? 'true' : undefined}
  />

  {#if description}
    <label class="label" for={name}>
      <span class="label-text-alt text-info" id={descriptionId}>
        {description}
      </span>
    </label>
  {/if}
</label>
