<script>
  import TextInput from '$lib/text-input.svelte'
  import BookIcon from '$lib/icons/book-icon.svelte'
  import { page } from '$app/stores'
  import Form from '$lib/form.svelte'

  const returnTo = $page?.url?.searchParams?.get('returnTo')

  const getRegisterPath = () => (returnTo ? `/register?returnTo=${returnTo}` : '/register')
</script>

<div class="mx-auto max-w-md">
  <div class="text-primary flex flex-col items-center pt-8">
    <h1 class="text-4xl text-primary">Study Buddy</h1>
    <span><BookIcon size="48" /></span>
  </div>
  <hr />
  <h2>Login required</h2>

  <Form
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
</div>
