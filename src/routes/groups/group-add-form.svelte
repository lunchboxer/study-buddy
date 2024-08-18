<script>
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'

  export let activeSchoolYearId
</script>

<h2>Add a Group</h2>

<Form submitLabel="Create group" action="?/create" successMessage="Group created successfully">
  <input type="hidden" name="school_year_id" value={activeSchoolYearId} />
  <TextInput label="Name" />
  <TextInput label="Grade" />
</Form>
