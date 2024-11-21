<script>
  import Form from '$lib/form.svelte'
  import Fa from 'svelte-fa'
  import { faTimes } from '@fortawesome/free-solid-svg-icons'
  import TextInput from '$lib/text-input.svelte'
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import TagAutocomplete from '$lib/tag-autocomplete.svelte'

  export let data
  const { allTags } = data
</script>

<Breadcrumbs crumbs={[{ name: 'Words', href: '/words' }, { name: data.word.word }]} />

<h1>Edit word</h1>

<Form action="?/update" submitLabel="Save">
  <input type="hidden" name="id" value={data.word.id} />
  <TextInput label="Word" name="word" data={data.word} />
</Form>

<h2>Tags</h2>

{#if data.word?.tags?.length > 0}
  <h3>Current tags</h3>
  <Form action="?/removeTag" inline>
    <ul>
      {#each data.word?.tags as tag}
        <li>
          <a href="?/tags/{tag.id}">{tag.name}</a><button
            class="btn btn-ghost btn-sm"
            name="id"
            value={tag.id}
          >
            <Fa icon={faTimes} />
          </button>
        </li>
      {/each}
    </ul>
  </Form>
{:else}
  <p>No tags yet attached to word</p>
{/if}

<h3>Add new or existing tag</h3>
<Form action="?/attachTag" submitLabel="Attach">
  {#if allTags?.length > 0}
    <TagAutocomplete tags={allTags} label="Tag" />
  {/if}
</Form>
