<script>
  import ActiveSchoolYearForm from '$lib/active-school-year-form.svelte'
  import SchoolYearAddForm from '../school-years/school-year-add-form.svelte'

  export let data
</script>

<h1>Setup</h1>
<p>A few things need to be set up before anything else can be done.</p>
{#if data?.schoolYears?.length === 0}
  <SchoolYearAddForm />
{:else}
  <h2>Select active school year</h2>
  <p>A single school year must be selected to work on. This is usually the current school year.</p>

  <ActiveSchoolYearForm schoolYears={data.schoolYears} />
{/if}
