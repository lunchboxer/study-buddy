<script>
  import ActiveSchoolYearForm from '$lib/active-school-year-form.svelte'
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import SchoolYearAddForm from './school-year-add-form.svelte'
  export let data
</script>

<Breadcrumbs crumbs={[{ name: 'School years' }]} />

<h1>School years</h1>
{#if data.schoolYears}
  {#each data.schoolYears as schoolYear}
    <p>
      <a href="/school-years/{schoolYear.id}">"{schoolYear.name}"</a> : {schoolYear.start_date} to {schoolYear.end_date}
    </p>
  {/each}
{/if}

<h2>Change active school year</h2>
<ActiveSchoolYearForm
  schoolYears={data.schoolYears}
  activeSchoolYearId={data.me.activeSchoolYear}
/>

<SchoolYearAddForm />
