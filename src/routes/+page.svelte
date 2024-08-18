<script>
  import BookIcon from '$lib/icons/book-icon.svelte'
  export let data
</script>

<div class="container h-full mx-auto flex justify-center items-center">
  <div class="space-y-10 text-center flex flex-col items-center">
    <BookIcon size="10rem" />
    <h2 class="h2">Welcome to Study Buddy.</h2>

    <h3>Active school year</h3>
    <p>{data?.schoolYears?.find((sy) => sy.id === data.me.active_school_year)?.name}</p>
  </div>
</div>
