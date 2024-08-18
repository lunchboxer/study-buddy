<script>
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  import { page } from '$app/stores'
  import TrayIcon from '$lib/icons/tray-icon.svelte'

  const returnTo = $page?.url?.searchParams?.get('returnTo')

  const getLoginPath = () => (returnTo ? `/login?returnTo=${returnTo}` : '/login')
</script>

<div class="mx-auto max-w-md">
  <div class="text-primary flex flex-col items-center pt-8">
    <h1 class="text-4xl text-primary">Submitter</h1>
    <span><TrayIcon size="48" /></span>
  </div>
  <hr />
  <h2>Register</h2>

  <Form
    submitLabel="Register"
    successMessage="Registration successful"
    successUrl={returnTo || '/'}
  >
    <TextInput label="Username" autocomplete="username" />
    <TextInput label="Name" autocomplete="name" />
    <TextInput type="password" label="Password" autocomplete="new-password" />

    <p>Already have an account? <a href={getLoginPath()}>Log in</a></p>
  </Form>
</div>
