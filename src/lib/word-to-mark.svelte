<script>
import { page } from '$app/stores'
import CheckIcon from '$lib/icons/check-icon.svelte'
import MinusIcon from '$lib/icons/minus-icon.svelte'
import SlashIcon from '$lib/icons/slash-icon.svelte'
import RepeatIcon from '$lib/icons/repeat-icon.svelte'
import UserCheckIcon from '$lib/icons/user-check-icon.svelte'
import DeleteIcon from '$lib/icons/delete-icon.svelte'

export let word
export let index

const markTypes = [
  { type: 'accurate', icon: CheckIcon },
  { type: 'omission', icon: MinusIcon },
  { type: 'substitution', icon: SlashIcon },
  { type: 'repetition', icon: RepeatIcon },
  { type: 'self-correction', icon: UserCheckIcon },
]

const markWord = async type => {
  word = `[${type}]${parseWord(word).text}[/${type}]`
  if (type === 'unmark') {
    word = parseWord(word).text
  }
  const fullUrl = `${$page.url.href}/mark-word`
  await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ index, type }),
  })
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
  <span role="button" class="m-1 word {parseWord(word).type}">
    {parseWord(word).text}
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
          class="tooltip tooltip-right m-0"
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
        <span
          class="tooltip tooltip-right m-0"
          data-tip="remove mark"
          on:click={() => markWord('unmark')}
        >
          <svelte:component this={DeleteIcon} />
        </span>
      </li>
    {/if}
  </ul>
</span>

<style>
  .accurate {
    color: green;
  }
  .omission {
    text-decoration: line-through;
    color: red;
  }
  .substitution,
  .repetition {
    color: red;
  }
  .self-correction {
    color: yellow;
  }
</style>
