<script>
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  import Breadcrumbs from '$lib/breadcrumbs.svelte'

  export let data
</script>

<Breadcrumbs crumbs={[{ name: 'Words', href: '/words' }, { name: data.word.word }]} />

<h1>Edit word</h1>

<Form action="?/update" submitLabel="Save">
  <input type="hidden" name="id" value={data.word.id} />
  <TextInput label="Word" name="word" data={data.word} />
</Form>
