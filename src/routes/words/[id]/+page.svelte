<script>
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import TagAutocomplete from '$lib/tag-autocomplete.svelte'
  import MinusIcon from '$lib/icons/minus-icon.svelte'
  import DeleteModal from '$lib/delete-modal.svelte'

  export let data
  $: otherTags = data.allTags?.filter((tag) => {
    return !data.word?.tags?.some((wordTag) => wordTag.id === tag.id)
  })
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
  <Form action="?/removeTag" inline successMessage="Tag removed">
    <ul>
      {#each data.word?.tags as tag}
        <li>
          <a href="?/tags/{tag.id}">{tag.name}</a><button
            class="btn btn-xs ml-2"
            name="id"
            value={tag.id}
          >
            <MinusIcon />
          </button>
        </li>
      {/each}
    </ul>
  </Form>
{:else}
  <p>No tags yet attached to word</p>
{/if}

<h3>Add new or existing tag</h3>
<Form action="?/attachTag" submitLabel="Attach" successMessage="Tag attached">
  {#if otherTags?.length > 0}
    <TagAutocomplete tags={otherTags} label="Tag" />
  {/if}
</Form>

<hr />

<DeleteModal thingName="word" thing={data.word} name={data.word.word} />
