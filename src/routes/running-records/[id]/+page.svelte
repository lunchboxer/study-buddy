<script>
  import { page } from '$app/stores'
  import DeleteModal from '$lib/delete-modal.svelte'
  import Form from '$lib/form.svelte'
  import TextArea from '$lib/text-area.svelte'
  import { dateToLocal } from '$lib/utils'
  import WordToMark from './word-to-mark.svelte'
  import RecordStats from './record-stats.svelte'

  export let data

  let showRawRecord = false
  let words = data.runningRecord?.marked_text.split(/\s+/)

  const writeRawRecord = async () => {
    // await invalidate(`running-records/${data.runningRecord.id}`)
    words = data.runningRecord?.marked_text.split(/\s+/)
    showRawRecord = false
  }

  const resetRawRecord = () => {
    showRawRecord = false
  }
  const markAll = async (type) => {
    let all = ''
    if (type === 'unmarkAll') {
      all = data.runningRecord?.marked_text.replaceAll(/\[\/?[a-z-]+]/gm, '')
      words = all.split(/\s+/).filter((word) => !word.startsWith('[insertion]'))
    }
    if (type === 'allAccurate') {
      words = data.runningRecord?.marked_text
        .split(/\s+/)
        .filter((word) => !word.startsWith('[insertion]'))
      for (let index = 0; index < words.length; index++) {
        words[index] = `[accurate]${words[index].replaceAll(/\[\/?[a-z-]+]/gm, '')}[/accurate]`
      }
      all = words.join(' ')
    }

    const fullUrl = `${$page.url.href}/mark-word`
    await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ all, userId: data.me.id }),
    })
  }
</script>

{#if data.runningRecord}
  <h1>Running Record for {data.runningRecord?.student_name}</h1>

  <p>{dateToLocal(data.runningRecord?.created)}</p>

  <audio controls src={data.runningRecord?.audio_url}>
    Your browser does not support the
    <code>audio</code> element.
  </audio>

  <RecordStats {words} lexile={data.runningRecord?.lexile} />

  <h2>{data.runningRecord?.text_title}</h2>

  <div class="mr-8 text-xl" style="line-height: 2; cursor: pointer;">
    {#each words as word, index}
      <WordToMark {word} {index} bind:words />
    {/each}
  </div>

  <br />
  <button
    on:click={() => {
      markAll('unmarkAll')
    }}
    class="btn btn-warning">Unmark All</button
  >
  <button
    on:click={() => {
      markAll('allAccurate')
    }}
    class="btn btn-success">All correct</button
  >

  <div class="my-8">
    <Form action="?/update" id="comment-form">
      <input type="hidden" name="id" value={data.runningRecord.id} />
      <TextArea label="Comments" data={data.runningRecord} name="comments" rows="3" />
    </Form>
  </div>

  <DeleteModal thing={data.runningRecord} thingName="running record" />

  {#if !showRawRecord}
    <button class="btn" on:click={() => (showRawRecord = true)}>Edit raw record</button>
  {:else}
    <div class="my-8">
      <Form
        action="?/update"
        id="raw-record-form"
        onSuccess={writeRawRecord}
        onReset={resetRawRecord}
      >
        <label for="raw-record" class="form-control w-full max-w-md mb-4">
          <div class="label">
            <span class="label-text">Raw Record</span>
          </div>
          <input type="hidden" name="id" value={data.runningRecord.id} />
          <textarea
            rows="10"
            class="textarea textarea-bordered"
            id="raw-record"
            value={words.join(' ')}
            name="marked_text"
          />
        </label>
      </Form>
    </div>
  {/if}

  {#if data.runningRecord?.marked_by_name}
    <p>Marked by: {data.runningRecord?.marked_by_name}</p>
  {/if}
{:else}
  <p>No running record found.</p>
{/if}
