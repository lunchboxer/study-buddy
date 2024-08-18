<script>
  import { nanoid } from 'nanoid'
  export let heading = 'Attention!'
  export let message = 'Are you sure you want to do this?'

  export let modal
  export let id = nanoid(8)
</script>

<dialog {id} bind:this={modal} class="modal modal-bottom sm:modal-middle">
  <div class="modal-box">
    <h2 class="font-bold text-xl">{heading}</h2>
    <p class="py-4">{message}</p>
    <slot />
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
