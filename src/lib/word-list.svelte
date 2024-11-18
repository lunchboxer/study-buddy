<script>
  import Fa from 'svelte-fa'
  import { faMagnifyingGlass, faTrash, faPencil } from '@fortawesome/free-solid-svg-icons'

  export let data
  let searchTerm = ''
  let selectedTagIds = []

  // Reactive statements to filter words
  $: filteredWords = data.words.filter((word) => {
    const matchesSearch =
      searchTerm === '' || word.word.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTags = selectedTagIds.every((tagId) => word.tags.some((tag) => tag.id === tagId))
    return matchesSearch && matchesTags
  })

  function toggleTag(tagId) {
    selectedTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId]
  }
</script>

{#if data.words?.length > 0}
  <label class="input input-bordered flex items-center gap-2 max-w-md mb-4">
    <input type="text" class="grow" placeholder="Search" bind:value={searchTerm} />
    <Fa icon={faMagnifyingGlass} />
  </label>

  {#if data.tags?.length > 0}
    <div class="flex gap-2 mb-4 tag-list">
      Filter by tag:
      {#each data.tags as tag}
        <div class="badge badge-neutral" class:badge-primary={selectedTagIds.includes(tag.id)}>
          <button on:click={() => toggleTag(tag.id)}>
            {tag.name}
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Results count -->
  <div class="text-sm text-gray-600">
    Showing {filteredWords.length} of {data.words.length} words
    {#if searchTerm || selectedTagIds.length > 0}
      (filtered)
    {/if}
  </div>

  <!-- Word list -->
  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th>#</th>
          <th>Word</th>
          <th>Tags</th>
          <th>actions</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredWords as word, index (word.id)}
          <tr>
            <th>{index + 1}</th>
            <td>{word.word}</td>
            <td>{word.tags.map((t) => t.name).join(', ')}</td>
            <td>
              <button class="btn btn-xs btn-circle">
                <Fa icon={faPencil} />
              </button>
              <button class="btn btn-xs btn-circle">
                <Fa icon={faTrash} />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Empty state -->
  {#if filteredWords.length === 0}
    <div class="text-center py-12">
      <div class="text-gray-400">
        {#if searchTerm || selectedTagIds.length > 0}
          No words match your filters
        {:else}
          No words added yet
        {/if}
      </div>
    </div>
  {/if}
{/if}

<style>
  .tag-list {
    align-items: baseline;
  }
</style>
