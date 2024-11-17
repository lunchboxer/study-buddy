<script>
  import Breadcrumbs from '$lib/breadcrumbs.svelte'
  import Form from '$lib/form.svelte'
  import TextInput from '$lib/text-input.svelte'
  import Select from '$lib/select.svelte'
  import WordList from '$lib/word-list.svelte'

  export let data
  let words = ''
  const parseWords = (words) =>
    words
      .split(/[\n,]+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 0)
</script>

<Breadcrumbs crumbs={[{ name: 'Words' }]} />

<h1>Words</h1>

<p>There are {data.words?.length} words in the database.</p>
<WordList {data} />

<h2>Tags</h2>
<p>There are {data.tags?.length} tags in the database.</p>

<h2>Add word(s)</h2>
<Form
  action="?/create"
  submitLabel="Add word(s)"
  successMessage="Word(s) added successfully"
  onSuccess={() => (words = '')}
>
  {#if data.tags?.length}
    <Select
      label="Tag"
      name="existingTagId"
      options={data.tags.map((t) => ({ label: t.name, value: t.id }))}
    />
  {/if}
  <TextInput label="New tag" name="newTagName" />

  <label for={words} class="form-control w-full max-w-md mb-4">
    <div class="label">
      <span class="label-text">Word(s)</span>
    </div>
    <textarea id="words" required rows="4" class="textarea textarea-bordered" bind:value={words} />

    <label class="label" for="words">
      <span class="label-text-alt text-info">Separate words with new lines or commas.</span>
    </label>
  </label>
  <input type="hidden" name="words" value={parseWords(words)} />
</Form>
