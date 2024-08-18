<script>
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  import TextArea from '$lib/text-area.svelte'
</script>

<h2>Add a running record text</h2>

<Form
  submitLabel="Add text"
  successMessage="Text added successfully"
  successUrl="/running-record-texts"
  action="?/create"
>
  <TextInput label="Title" required />
  <TextInput label="Source" />
  <TextInput label="Lexile" type="number" min="1" max="2000" />
  <TextArea label="Text" rows={12} required />
</Form>
