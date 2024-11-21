<script>
  import { onMount } from 'svelte'

  export let tags
  export let name = 'tag_name'
  export let idName = 'tag_id'
  export let label = 'Select Tag'

  let inputValue = ''
  let isOpen = false
  let selectedTag
  let dropdownReference

  $: filteredTags =
    tags?.filter((tag) => tag.name.toLowerCase().includes(inputValue.toLowerCase())).slice(0, 10) ||
    []

  const handleClickOutside = (event) => {
    if (dropdownReference && !dropdownReference.contains(event.target)) {
      isOpen = false
    }
  }
  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  })
</script>

<div class="form-control w-full max-w-xs relative" bind:this={dropdownReference}>
  <label class="label" for="tag-autocomplete">
    <span class="label-text">{label}</span>
  </label>

  <div class="relative w-full">
    <input
      {name}
      id="tag-autocomplete"
      type="text"
      class="input input-bordered w-full"
      bind:value={inputValue}
      on:focus={() => (isOpen = true)}
      on:input={() => (isOpen = true)}
    />

    {#if isOpen && filteredTags?.length > 0}
      <div
        class="absolute top-full left-0 w-full z-50 mt-1
               bg-base-100 rounded-lg shadow-lg border border-base-300
               max-h-60 overflow-y-auto"
      >
        <ul class="menu">
          {#each filteredTags as tag}
            <li>
              <button
                class="hover:bg-base-200 rounded-lg"
                on:click={() => {
                  selectedTag = tag
                  inputValue = tag.name
                  isOpen = false
                }}
              >
                {tag.name}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>

  {#if selectedTag && selectedTag.name === inputValue}
    <input type="hidden" name={idName} value={selectedTag.id} />
  {/if}
</div>

<style>
  .absolute {
    top: 100%;
    transform: translateY(0);
  }
</style>
