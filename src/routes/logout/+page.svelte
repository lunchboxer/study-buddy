<script>
  import Form from '$lib/form.svelte'
  import { goto } from '$app/navigation'

  const reset = () => {
    goto('/')
  }
</script>

<div class="container mx-auto max-w-md">
  <h1>Log out</h1>
  <p>We are going to miss you.</p>
  <Form
    submitLabel="Get me out of here"
    resetLabel="Nevermind"
    successMessage="Logout successful"
    successUrl="/login"
    on:reset={reset}
  />
</div>
