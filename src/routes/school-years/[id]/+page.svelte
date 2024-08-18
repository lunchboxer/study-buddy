<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  import DeleteModal from '$lib/delete-modal.svelte'

  export let data
  const { schoolYear } = data
</script>

<Breadcrumbs
  crumbs={[{ name: 'School years', href: '/school-years' }, { name: schoolYear?.name }]}
/>

<h1>Edit School Year</h1>

<Form submitLabel="Update" action="?/update" successUrl="/school-years">
  <input type="hidden" name="id" value={schoolYear?.id} />
  <TextInput label="Name" data={schoolYear} />
  <TextInput label="Start date" type="date" data={schoolYear} />
  <TextInput label="End date" type="date" data={schoolYear} />
</Form>

<hr />

<DeleteModal thing={schoolYear} thingName="school year" />
