<script>
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
</script>

<h2>Add a school year</h2>
<Form
  submitLabel="Add"
  successUrl="/school-years"
  action="?/create"
  successMessage="School year added successfully"
>
  <TextInput label="Name" />
  <TextInput label="Start date" type="date" />
  <TextInput label="End date" type="date" />
</Form>
