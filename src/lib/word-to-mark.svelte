<script>
import { page } from '$app/stores'
import CheckIcon from '$lib/icons/check-icon.svelte'
import MinusIcon from '$lib/icons/minus-icon.svelte'
import SlashIcon from '$lib/icons/slash-icon.svelte'
import RepeatIcon from '$lib/icons/repeat-icon.svelte'
import UserCheckIcon from '$lib/icons/user-check-icon.svelte'
import DeleteIcon from '$lib/icons/delete-icon.svelte'
import PlusIcon from '$lib/icons/plus-icon.svelte'

export let word
export let index
export let words

let insertionText = ''
let modal
let position = 'before'
let inserting = false

const setPosition = event => {
  position = event.target.value
}

const cancelInsert = () => {
  insertionText = ''
  position = 'before'
  inserting = false
  modal.close()
}

const markTypes = [
  { type: 'accurate', icon: CheckIcon },
  { type: 'omission', icon: MinusIcon },
  { type: 'substitution', icon: SlashIcon },
  { type: 'repetition', icon: RepeatIcon },
  { type: 'self-correction', icon: UserCheckIcon },
  { type: 'insertion', icon: PlusIcon },
]

const markWord = async type => {
  if (type === 'insertion' && insertionText === '') {
    modal.showModal()
    return
  }
  if (type === 'insertion') {
    inserting = true
    const newWord = `[insertion]${insertionText}[/insertion]`
    // insert newWord based on position and index
    if (position === 'before') {
      words.splice(index, 0, newWord)
    } else {
      words.splice(index + 1, 0, newWord)
    }
    const all = words.join(' ')
    const fullUrl = `${$page.url.href}/mark-word`
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ all }),
    })
    const data = await response.json()
    words = data.marked_text.split(/\s+/)
    cancelInsert()
    return
  }
  if (type === 'unmark') {
    if (parseWord(word).type === 'insertion') {
      // remove the word from words array
      words.splice(index, 1)
      const all = words.join(' ')
      const fullUrl = `${$page.url.href}/mark-word`
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ all }),
      })
      const data = await response.json()
      words = data.marked_text.split(/\s+/)
      return
    }
    word = parseWord(word).text
  }
  word = `[${type}]${parseWord(word).text}[/${type}]`
  const fullUrl = `${$page.url.href}/mark-word`
  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ index, type }),
  })
  const data = await response.json()
  words = data.marked_text.split(/\s+/)
}

function parseWord(word) {
  const match = word.match(/\[(.*?)\](.*?)\[\/.*?\]/)
  if (match) {
    return { type: match[1], text: match[2] }
  }
  return { type: undefined, text: word }
}
</script>

<span class="dropdown dropdown-hover">
  <span role="button" class="m-0 p-0 {parseWord(word).type}">
    {#if parseWord(word).type === 'insertion'}
      <sup class="insertion">
        ^{parseWord(word).text}
      </sup>
    {:else}
      {parseWord(word).text}
    {/if}
    {#if parseWord(word).type === 'repetition'}
      <sup class="repetition">
        {parseWord(word).text}
      </sup>
    {/if}
  </span>
  <ul class="dropdown-content shadow z-[1] menu bg-base-300 m-0 p-1">
    {#each markTypes as { type, icon }}
      <li class="p-1 m-0">
        <span
          class="tooltip m-0"
          class:bg-base-100={parseWord(word).type === type}
          data-tip={type}
          on:click={() => markWord(type)}
        >
          <svelte:component this={icon} />
        </span>
      </li>
    {/each}
    {#if parseWord(word).type}
      <li class="p-1 m-0">
        <span class="tooltip m-0" data-tip="remove mark" on:click={() => markWord('unmark')}>
          <svelte:component this={DeleteIcon} />
        </span>
      </li>
    {/if}
  </ul>
</span>

<dialog bind:this={modal} class="modal">
  <div class="modal-box">
    <input type="hidden" name="index" value={index} />
    <label class="form-control w-full max-w-md mb-4">
      <div class="label">Insertion Text</div>
      <input
        type="text"
        bind:value={insertionText}
        name="text"
        required
        class="input input-bordered w-full"
      />
    </label>

    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">
          Before: "{#if words[index - 1]}
            {parseWord(words[index - 1]).text}
          {/if}
          <sup class="insertion">^{insertionText}</sup>
          {parseWord(word).text}"
        </span>
        <input
          type="radio"
          value="before"
          on:change={setPosition}
          name="insertion-position"
          class="radio"
          checked
        />
      </label>
    </div>

    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">
          After: "{parseWord(word).text}
          {#if words[index + 1]}
            <sup class="insertion">^{insertionText}</sup>
            {parseWord(words[index + 1]).text}"
          {:else}
            <sup class="insertion">^{insertionText}</sup>"
          {/if}
        </span>
        <input
          type="radio"
          value="after"
          on:change={setPosition}
          name="insertion-position"
          class="radio"
        />
      </label>
    </div>

    <div class="button-group justify-end flex flex-wrap py-4">
      <button class="btn grow" on:click={cancelInsert}>Cancel</button>
      <button
        class="btn btn-primary grow"
        disabled={inserting}
        on:click={() => markWord('insertion')}
      >
        {#if inserting}
          <span class="loading loading-spinner"></span>
          loading
        {:else}
          Insert
        {/if}
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<style>
  .accurate {
    color: oklch(var(--su));
  }
  .omission {
    text-decoration: line-through;
    color: oklch(var(--er));
  }
  .substitution,
  .insertion,
  .repetition {
    color: oklch(var(--er));
  }
  .self-correction {
    color: oklch(var(--wa));
  }
</style>
