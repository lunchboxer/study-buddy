<script>
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  import Select from '$lib/select.svelte'
  import { page } from '$app/stores'
</script>

{#if $page?.data?.groups?.length}
  <h2>Add a Student</h2>

  <Form
    submitLabel="Create student"
    successMessage="Student created successfully"
    successUrl="/students"
    action="?/create"
  >
    <TextInput label="Name" />
    <Select
      label="Group"
      name="student_group_id"
      options={$page?.data?.groups.map((g) => ({ label: g.name, value: g.id }))}
    />
  </Form>
{:else}
  <h2>Cannot add students</h2>
  <p>There are no groups yet in the active school year to add students to.</p>
  <p>Please <a href="/groups">create a group</a> first.</p>
{/if}
