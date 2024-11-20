<script>
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import DeleteModal from '$lib/delete-modal.svelte'
  import Select from '$lib/select.svelte'
  import PasswordToIcons from '$lib/password-to-icons.svelte'

  export let data
  $: student = data?.student
  $: studentGroups = data?.studentGroups
  const { groups, me, schoolYears } = data
  const options = groups.map((g) => ({ label: g.name, value: g.id }))

  const oneIsActive = (studentGroups) => {
    return studentGroups.some((g) => g.school_year_id === me.active_school_year)
  }
</script>

<Breadcrumbs crumbs={[{ href: '/students', name: 'Students' }, { name: student?.name }]} />

<h1>Edit student</h1>

<Form action="?/update" submitLabel="Update" successMessage="Student record updated">
  <input type="hidden" name="id" value={student?.id} />
  <TextInput label="Name" data={student} />
</Form>

<h2>Student groups</h2>
{#if groups?.length}
  {#if studentGroups?.length > 0}
    <ul>
      {#each studentGroups as group}
        <li>
          <a href="/groups/{group.id}">
            {group.name}
          </a>
          {#if group.school_year_id === me.active_school_year}
            <span class="badge badge-secondary">
              {schoolYears.find((s) => s.id === group.school_year_id)?.name} (active)
            </span>
          {:else}
            <span class="badge badge-ghost">
              {schoolYears.find((s) => s.id === group.school_year_id)?.name}
            </span>
          {/if}

          <Form
            inline="true"
            method="post"
            action="?/removeFromGroup"
            successMessage="Removed from group {group?.name}"
          >
            <input type="hidden" name="student_id" value={student?.id} />
            <input type="hidden" name="student_group_id" value={group?.id} />
            <button class="btn btn-circle btn-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-4 h-4 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                >
                </path>
              </svg>
            </button>
          </Form>
        </li>
      {/each}
    </ul>
  {:else}
    <p>Student not added to a group yet.</p>
  {/if}

  {#if !oneIsActive(studentGroups)}
    <h3>Add student to a group</h3>
    <Form action="?/addGroup" submitLabel="Add" successMessage="Student added to group">
      <input type="hidden" name="student_id" value={student?.id} />
      <Select label="Group" name="student_group_id" {options} />
    </Form>
  {/if}
{:else}
  <p>There are no groups yet in the active school year to add students to.</p>
  <p>Please <a href="/groups">create a group</a> first.</p>
{/if}

<h2>Password</h2>
<PasswordToIcons password={student?.password} />

<hr />

<h3>Archiving/deactivating</h3>
<p>
  When a student leaves the school or no longer should show up in student group lists, they can be
  archived and deactivated without deleting them.
</p>
<Form
  inline="true"
  action="?/toggleArchive"
  successMessage={student?.archived
    ? 'Student successfully unarchived'
    : 'Student successfully archived'}
>
  <input type="hidden" name="student_id" value={student?.id} />
  <input type="hidden" name="archived" value={student?.archived ? 0 : 1} />
  <button class="btn" type="submit"> {student?.archived ? 'Unarchive' : 'Archive'} Student </button>
</Form>

<hr />
<DeleteModal thing={student} thingName="student" />
