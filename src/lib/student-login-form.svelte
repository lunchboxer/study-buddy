<script>
  import Form from '$lib/form.svelte'
  import PasswordPicker from '$lib/password-picker.svelte'

  let studentId
  let password = []
  export let students = []

  const backToStudents = () => {
    studentId = undefined
  }
</script>

{#if !studentId}
  {#if students.length === 0}
    <p>No students found</p>
  {:else}
    <p>Select a student to log in</p>
  {/if}
  <div class="flex flex-wrap gap-2 my-4">
    {#each students as student}
      <button on:click={() => (studentId = student.id)} class="btn">
        {student.name}
      </button>
    {/each}
  </div>
{:else}
  <button on:click={backToStudents} class="btn"> Student list </button>
  <p>Enter the password for {students.find((s) => s.id === studentId).name}</p>
  <PasswordPicker bind:password />

  <Form action="?/studentLogin" onReset={() => (password = [])} submitLabel="Log in">
    <input type="hidden" name="studentId" value={studentId} />
    <input type="hidden" name="password" value={password} />
  </Form>
{/if}
