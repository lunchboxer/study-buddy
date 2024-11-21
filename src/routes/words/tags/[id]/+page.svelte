<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import DeleteModal from '$lib/delete-modal.svelte'
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  import TagAutocomplete from '$lib/tag-autocomplete.svelte'

  export let data
  const { tag, tags } = data
</script>

<Breadcrumbs
  crumbs={[
    { name: 'Words', href: '/words' },
    { name: 'Tags', href: '/words/tags' },
    { name: data.tag.name },
  ]}
/>

<h1>Edit Word tag</h1>

<Form action="?/update" submitLabel="Update" successUrl="/words/tags">
  <input type="hidden" name="id" value={tag.id} />
  <TextInput label="Name" data={tag} />
  <TextInput type="number" min="0" label="Order index" data={tag} name="order_index" />
</Form>

<h2>Add Parent Tag</h2>

<Form action="?/addParentTag" submitLabel="Add" successUrl="/words/tags">
  <input type="hidden" name="tag_id" value={tag.id} />
  <TagAutocomplete {tags} name="parent_tag_name" idName="parent_tag_id" />
</Form>

<hr />

<DeleteModal thing={tag} thingName="tag" />
