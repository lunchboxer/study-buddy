<script>
  import Fa from 'svelte-fa'
  import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

  export let data
  let searchTerm = ''
  let selectedTagIds = []
  let showOnlyUntagged = false
  let isAndMode = false // false = OR (default), true = AND. Words can match any tags in OR mode, but must match all tags in AND mode.

  // Reactive statements to filter words
  $: filteredWords = data.words.filter((word) => {
    const matchesSearch =
      searchTerm === '' || word.word.toLowerCase().includes(searchTerm.toLowerCase())

    if (showOnlyUntagged) {
      return matchesSearch && word.tags.length === 0
    }

    // New function to check if a word's tags include a tag that matches selected tags or their children
    const matchesSelectedTags = (selectedTagIds) => {
      if (selectedTagIds.length === 0) return true

      const allRelevantTagIds = [
        ...selectedTagIds,
        // Add child tag IDs for each selected tag
        ...data.tags
          .filter((tag) => selectedTagIds.includes(tag.parent_tag_id))
          .map((tag) => tag.id),
      ]

      return isAndMode
        ? allRelevantTagIds.every((tagId) => word.tags.some((tag) => tag.id === tagId))
        : allRelevantTagIds.some((tagId) => word.tags.some((tag) => tag.id === tagId))
    }

    return matchesSearch && matchesSelectedTags(selectedTagIds)
  })

  function toggleTag(tagId) {
    showOnlyUntagged = false
    selectedTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId]
  }

  function toggleShowOnlyUntagged() {
    showOnlyUntagged = !showOnlyUntagged
    selectedTagIds = []
  }
</script>

{#if data.words?.length > 0}
  <label class="input input-bordered flex items-center gap-2 max-w-md mb-4">
    <input type="text" class="grow" placeholder="Search" bind:value={searchTerm} />
    <Fa icon={faMagnifyingGlass} />
  </label>

  {#if data.tags?.length > 0}
    <div class="flex gap-2 mb-4 tag-list flex-wrap">
      Filter by tag:
      <div class="badge badge-neutral" class:badge-primary={showOnlyUntagged}>
        <button on:click={toggleShowOnlyUntagged}> no tags </button>
      </div>
      {#each data.tags as tag}
        <div class="badge badge-neutral" class:badge-primary={selectedTagIds.includes(tag.id)}>
          <button on:click={() => toggleTag(tag.id)}>
            {tag.name}
          </button>
        </div>
      {/each}
    </div>

    {#if !showOnlyUntagged}
      <div class="form-control">
        <label class="label cursor-pointer gap-2">
          <span class="label-text">Match All Tags</span>
          <input type="checkbox" class="toggle toggle-primary" bind:checked={isAndMode} />
        </label>
      </div>
    {/if}
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
          <th>Audio</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredWords as word, index (word.id)}
          <tr>
            <th>{index + 1}</th>
            <td><a href="/words/{word.id}">{word.word}</a></td>
            <td>{word.tags.map((t) => t.name).join(', ')}</td>
            <td>
              {#if word.audio.length === 0}
                <a href="/words/audio" class="link link-primary">Needs audio</a>
              {:else}
                <span class="text-success"
                  >✓ Has {word.audio.length} recording{word.audio.length > 1 ? 's' : ''}</span
                >
              {/if}
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
