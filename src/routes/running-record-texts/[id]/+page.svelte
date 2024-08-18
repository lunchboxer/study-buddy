<script>
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  import TextArea from '$lib/text-area.svelte'
  import DeleteModal from '$lib/delete-modal.svelte'
  import Breadcrumbs from '$lib/breadcrumbs.svelte'

  export let data
</script>

<Breadcrumbs
  crumbs={[
    { href: '/running-record-texts', name: 'Running Record Texts' },
    { name: data.runningRecordText?.title },
  ]}
/>

<h1>Edit Running Record Text</h1>

<Form
  action="?/update"
  submitLabel="Update"
  successMessage="text updated successfully"
  successUrl="/running-record-texts"
>
  <input type="hidden" name="id" value={data.runningRecordText?.id} />
  <TextInput label="Title" data={data.runningRecordText} />
  <TextInput label="Source" data={data.runningRecordText} />
  <TextInput label="Lexile" type="number" data={data.runningRecordText} />
  <TextArea label="Text" data={data.runningRecordText} />
</Form>

<hr />

<DeleteModal thing={data.runningRecordText} thingName="running record text" />
