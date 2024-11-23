<script>
  import Form from '$lib/form.svelte'
  import Modal from '$lib/modal.svelte'

  export let modal
</script>

<Modal bind:modal id="logoutmodal" heading="Log out" message="We are going to miss you. 🫂">
  <Form
    action="/logout"
    id="logout-form"
    submitLabel="Get me out of here"
    resetLabel="Nevermind"
    successMessage="Logout successful"
    successUrl="/login"
    onReset={() => modal.close()}
  />
</Modal>
