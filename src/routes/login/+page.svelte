<script>
  import TextInput from '$lib/text-input.svelte'
  import BookIcon from '$lib/icons/book-icon.svelte'
  import StudentLoginForm from '$lib/student-login-form.svelte'
  import { page } from '$app/stores'
  import Form from '$lib/form.svelte'
  import Fa from 'svelte-fa'
  import { faChildReaching, faPersonChalkboard } from '@fortawesome/free-solid-svg-icons'

  const returnTo = $page?.url?.searchParams?.get('returnTo')

  const getRegisterPath = () => (returnTo ? `/register?returnTo=${returnTo}` : '/register')

  export let data

  let role
</script>

<div class="mx-auto max-w-md">
  <div class="text-primary flex flex-col items-center pt-8">
    <h1 class="text-4xl text-primary">Study Buddy</h1>
    <span><BookIcon size="48" /></span>
  </div>
  <h2>Login required</h2>

  {#if !role}
    <div class="flex justify-end gap-2 mb-4">
      <button
        class:btn-secondary={role === 'student'}
        class:btn-active={role === 'student'}
        class="btn grow btn-lg"
        on:click={() => (role = 'student')}
      >
        <Fa icon={faChildReaching} size="2x" />
        <span>Student</span>
      </button>
      <button
        class:btn-secondary={role === 'teacher'}
        class:btn-active={role === 'teacher'}
        class="btn btn-lg grow"
        on:click={() => (role = 'teacher')}
      >
        <Fa icon={faPersonChalkboard} size="2x" />
        <span>Teacher</span>
      </button>
    </div>
  {/if}

  {#if role === 'student'}
    <button class="btn" on:click={() => (role = 'teacher')}> Not a student? </button>
    <StudentLoginForm students={data.students} />
  {/if}

  {#if role === 'teacher'}
    <button class="btn" on:click={() => (role = 'student')}> Not a teacher? </button>
    <Form
      action="?/login"
      id="login"
      submitLabel="Log in"
      successMessage="Login successful"
      successUrl={returnTo || '/'}
    >
      <TextInput label="Username" autocomplete="username" />
      <TextInput label="Password" type="password" autocomplete="current-password" />
      <p>
        Don't have an account? <a href={getRegisterPath()}> Register </a>
      </p>
    </Form>
  {/if}
</div>
