<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  import DeleteModal from '$lib/delete-modal.svelte'

  export let data
  const { subject } = data
</script>

<Breadcrumbs crumbs={[{ name: 'Subjects', href: '/subjects' }, { name: subject?.name }]} />

<h1>Edit subject "{subject?.name}"</h1>

<Form action="?/update" submitLabel="Update" successUrl="/subjects">
  <input type="hidden" name="id" value={subject?.id} />
  <TextInput label="Name" data={subject} />
</Form>

<hr />

<DeleteModal thing={subject} thingName="subject" />
