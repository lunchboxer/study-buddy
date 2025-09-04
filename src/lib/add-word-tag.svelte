<script>
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
</script>

<Form action="?/addTag" submitLabel="Add tag" successMessage="Tag added">
  <TextInput label="Tag text" name="name" />
</Form>
