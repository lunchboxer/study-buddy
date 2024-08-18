<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  import DeleteModal from '$lib/delete-modal.svelte'
  import Select from '$lib/select.svelte'

  export let data
  $: group = data?.group
</script>

<Breadcrumbs crumbs={[{ name: 'Groups', href: '/groups' }, { name: group?.name }]} />

<h1>Edit group "{group?.name}"</h1>

<Form submitLabel="Update" action="?/update" successUrl="/groups">
  <input type="hidden" name="id" value={group?.id} />
  <TextInput label="Name" data={group} />
  <TextInput label="Grade" data={group} />
  <Select
    label="School Year"
    name="school_year_id"
    options={data?.schoolYears.map((s) => ({ label: s.name, value: s.id }))}
    selected={group?.school_year_id}
  />
</Form>

<hr />

<DeleteModal thing={group} thingName="group" />
