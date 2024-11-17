<script>
  import Fa from 'svelte-fa'
  import {
    faTimes,
    faMagnifyingGlass,
    faTag,
    faTrash,
    faPencil,
  } from '@fortawesome/free-solid-svg-icons'

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

  // Group tags by parent for the tag selector
  $: groupedTags = data.tags.reduce((accumulator, tag) => {
    if (!tag.parent_tag_id) {
      accumulator[tag.id] = {
        ...tag,
        children: data.tags.filter((t) => t.parent_tag_id === tag.id),
      }
    }
    return accumulator
  }, {})

  function toggleTag(tagId) {
    selectedTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId]
  }

  function removeTag(tagId) {
    selectedTagIds = selectedTagIds.filter((id) => id !== tagId)
  }

  // Get the tag object by ID
  function getTag(tagId) {
    return data.tags.find((t) => t.id === tagId)
  }
</script>

<div class="space-y-6">
  <div class="flex flex-col gap-4 md:flex-row md:items-center">
    <div class="relative flex-1">
      <!-- <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" /> -->
      <label class="input input-bordered flex items-center gap-2 max-w-md mb-4">
        <input type="text" class="grow" placeholder="Search" bind:value={searchTerm} />
        <Fa icon={faMagnifyingGlass} />
      </label>
    </div>

    <div class="dropdown dropdown-end">
      <label tabindex="0" class="btn btn-outline gap-2">
        <Fa icon={faTag} size="1.5x" />
        Filter by Tags
      </label>
      <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        {#each Object.values(groupedTags) as parentTag}
          <li>
            <button
              class="flex items-center gap-2 {selectedTagIds.includes(parentTag.id)
                ? 'active'
                : ''}"
              on:click={() => toggleTag(parentTag.id)}
            >
              {parentTag.name}
            </button>
            {#if parentTag.children.length > 0}
              <ul class="pl-4">
                {#each parentTag.children as childTag}
                  <li>
                    <button
                      class="flex items-center gap-2 {selectedTagIds.includes(childTag.id)
                        ? 'active'
                        : ''}"
                      on:click={() => toggleTag(childTag.id)}
                    >
                      {childTag.name}
                    </button>
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <!-- Active filters display -->
  {#if selectedTagIds.length > 0}
    <div class="flex flex-wrap gap-2">
      {#each selectedTagIds as tagId}
        {@const tag = getTag(tagId)}
        {#if tag}
          <div class="badge badge-secondary gap-2">
            <button on:click={() => removeTag(tagId)}>
              <Fa icon={faTimes} />
            </button>
            {tag.name}
          </div>
        {/if}
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
</div>
