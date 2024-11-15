<script>
  import Form from '$lib/form.svelte'
  import BookIcon from '$lib/icons/book-icon.svelte'
  import PasswordPicker from '$lib/password-picker.svelte'

  export let data

  let studentId
  let password = []
</script>

<div class="mx-auto max-w-md">
  <div class="text-primary flex flex-col items-center pt-8">
    <h1 class="text-4xl text-primary">Study Buddy</h1>
    <span><BookIcon size="48" /></span>
  </div>
  <hr />
  <h2>Login</h2>

  {#if !studentId}
    <p>Select a student to log in</p>
    <div class="flex flex-wrap gap-2 my-4">
      {#each data.students as student}
        <button on:click={() => (studentId = student.id)} class="btn">
          {student.name}
        </button>
      {/each}
    </div>
  {:else}
    <p>Enter the password for {data.students.find((s) => s.id === studentId).name}</p>
    <PasswordPicker bind:password />

    <Form action="?/login" onReset={() => (password = [])} submitLabel="Log in">
      <input type="hidden" name="studentId" value={studentId} />
      <input type="hidden" name="password" value={password} />
    </Form>
  {/if}
</div>
