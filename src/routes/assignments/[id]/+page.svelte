<script>
import Form from '$lib/form.svelte'
import TextInput from '$lib/text-input.svelte'
import Select from '$lib/select.svelte'
import TextArea from '$lib/text-area.svelte'
import RadioGroup from '$lib/radio-group.svelte'
import DeleteModal from '$lib/delete-modal.svelte'

export let data

const options = data.groups.map(g => ({ label: g.name, value: g.id }))
const selected = data.assignment?.student_group_id
</script>

<h1>Edit Assignment</h1>

<Form
  action="?/update"
  submitLabel="Update"
  successMessage="Assignment updated successfully"
  successUrl="/assignments"
>
  <input type="hidden" name="id" value={data.assignment?.id} />
  <TextInput label="Title" data={data.assignment} />
  <TextArea label="Description" data={data.assignment} />
  <Select label="Group" name="student_group_id" {options} {selected} />
  <RadioGroup name="type" data={data.assignment} options={['Classwork', 'Homework']} />
  <TextInput label="Assigned date" type="date" data={data.assignment} />
  <TextInput label="Due date" type="date" data={data.assignment} />
  <Select
    label="Subject"
    name="subject_id"
    options={data?.subjects?.map((s) => ({ label: s.name, value: s.id }))}
    selected={data.assignment?.subject_id}
  />
</Form>

<hr />

<DeleteModal thing={data.assignment} thingName="assignment" />
