<script>
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
</script>

<h2>Add subject</h2>

<Form
  submitLabel="Create subject"
  successMessage="Subject added successfully"
  successUrl="/subjects"
  action="?/create"
>
  <TextInput label="Name" />
</Form>
