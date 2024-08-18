<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  import TextArea from '$lib/text-area.svelte'
  import Select from '$lib/select.svelte'
  import RadioGroup from '$lib/radio-group.svelte'

  export let data

  const options = data.groups.map((g) => ({ label: g.name, value: g.id }))
  const selected = options?.length === 1 && data.groups[0].id

  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const formatDate = (date) => {
    if (date === today) {
      return 'Today'
    } else if (date === tomorrow) {
      return 'Tomorrow'
    } else {
      return new Date(date).toLocaleDateString()
    }
  }
</script>

<Breadcrumbs crumbs={[{ name: 'Assignments' }]} />

<h1>Assignments</h1>

{#if data.assignments?.length}
  <ul>
    {#each data.assignments as assignment}
      <li>
        <a href="/assignments/{assignment.id}">
          {assignment.title}
        </a>
        Due: {formatDate(assignment.due_date)}
      </li>
    {/each}
  </ul>
{/if}

{#if data.groups?.length && data.subjects?.length}
  <h2>Add a new assignment</h2>

  <Form
    action="?/create"
    submitLabel="Add"
    successMessage="Assignment created"
    successUrl="/assignments"
  >
    <TextInput label="Title" />
    <TextArea label="Description" />
    <Select label="Group" name="student_group_id" {options} {selected} />
    <RadioGroup name="type" options={['Classwork', 'Homework']} selected="homework" />
    <TextInput label="Assigned date" type="date" value={today} />
    <TextInput label="Due date" type="date" value={tomorrow} />
    <Select
      label="Subject"
      name="subject_id"
      options={data?.subjects?.map((s) => ({ label: s.name, value: s.id }))}
    />
  </Form>
{:else if !data.groups?.length}
  <p>No groups found.</p>
  <p>Please <a href="/groups">create a group</a> first.</p>
{:else}
  <p>No subjects found.</p>
  <p>Please <a href="/subjects">create a subject</a> first.</p>
{/if}
