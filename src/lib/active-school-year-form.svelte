<script>
  import Form from '$lib/form.svelte'
  import Select from '$lib/select.svelte'

  export let schoolYears
  export let activeSchoolYearId = ''

  let currentSchoolYear
  for (const sy of schoolYears) {
    if (
      Date.now() >= new Date(sy.start_date).getTime() &&
      Date.now() <= new Date(sy.end_date).getTime()
    ) {
      currentSchoolYear = sy.id
    }
  }
  const selected = activeSchoolYearId || currentSchoolYear || schoolYears[0]?.id
  $: options = schoolYears?.map((sy) => ({
    label: currentSchoolYear === sy.id ? `${sy.name} (current)` : sy.name,
    value: sy.id,
  }))
</script>

<Form
  action="/setup?/setActiveSchoolYear"
  submitLabel="Set active school year"
  successUrl="/"
  successMessage="Active school year set"
>
  <Select label="Active school year" {options} {selected} />
</Form>
