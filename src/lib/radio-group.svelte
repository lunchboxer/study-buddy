<script>
  import { page } from '$app/stores'
  import { toSnakeCase } from '$lib/utils'

  export let name = ''
  export let options = []
  export let processedOptions = options.map((o) =>
    typeof o === 'string' ? { label: o, value: toSnakeCase(o) } : o,
  )

  export let error = ''
  export let data = {}
  export let selected = $page?.form?.[name] ?? data?.[name] ?? ''
</script>

<span class="error-text">{$page?.form?.errors?.[name] || error}</span>
{#each processedOptions as { label, value }}
  <div class="form-control">
    <label class="label cursor-pointer">
      <span class="label-text">{label}</span>
      <input type="radio" {value} {name} class="radio" checked={value === selected} />
    </label>
  </div>
{/each}
