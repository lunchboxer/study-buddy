<script>
import { page } from '$app/stores'
import DeleteModal from '$lib/delete-modal.svelte'
import Form from '$lib/form.svelte'
import TextArea from '$lib/text-area.svelte'
import { dateToLocal } from '$lib/utils'
import WordToMark from '$lib/word-to-mark.svelte'

export let data

let showRawRecord = false
let words = data.runningRecord?.marked_text.split(/\s+/)
let newRawRecord = ''

const updateRawRecord = event => {
  newRawRecord = event.target.value
}
const writeRawRecord = () => {
  words = newRawRecord.split(/\s+/)
}
const markAll = async type => {
  let all = ''
  if (type === 'unmarkAll') {
    all = data.runningRecord?.marked_text.replace(/\[\/?[a-z-]+\]/gm, '')
    words = all.split(/\s+/).filter(word => !word.startsWith('[insertion]'))
  }
  if (type === 'allAccurate') {
    words = data.runningRecord?.marked_text
      .split(/\s+/)
      .filter(word => !word.startsWith('[insertion]'))
    for (let index = 0; index < words.length; index++) {
      words[index] =
        `[accurate]${words[index].replaceAll(/\[\/?[a-z-]+\]/gm, '')}[/accurate]`
    }
    all = words.join(' ')
  }

  const fullUrl = `${$page.url.href}/mark-word`
  await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ all }),
  })
}
const countWords = words => {
  let count = 0
  for (const word of words) {
    if (!word.startsWith('[insertion]')) {
      count++
    }
  }
  return count
}

const countErrors = words => {
  let errors = 0
  for (const word of words) {
    if (word.startsWith('[omission]')) {
      errors++
    }
    if (word.startsWith('[substitution]')) {
      errors++
    }
    if (word.startsWith('[repetition]')) {
      errors++
    }
    if (word.startsWith('[insertion]')) {
      errors++
    }
  }
  return errors
}
const countSelfCorrections = words => {
  let selfCorrections = 0
  for (const word of words) {
    if (word.startsWith('[self-correction]')) {
      selfCorrections++
    }
  }
  return selfCorrections
}
const getAccuracy = words =>
  Math.round(
    ((countWords(words) - countErrors(words)) / countWords(words)) * 100,
  )
const getDetermination = words => {
  const accuracy = getAccuracy(words)
  if (accuracy > 96) {
    return 'Easy: Consider advancement'
  }
  if (accuracy > 93) {
    return 'Appropriate instructional text'
  }
  if (accuracy >= 90) {
    return 'Challenging: may need support'
  }
  return 'Difficult: consider lower level'
}
</script>

<h1>Running Record for {data.runningRecord?.student_name}</h1>

<p>{dateToLocal(data.runningRecord?.created)}</p>

<audio controls src={data.runningRecord?.audio_url}>
  Your browser does not support the
  <code>audio</code> element.
</audio>

<br />

<div class="stats flex">
  <div class="stat">
    <div class="stat-title">Total Words</div>
    <div class="stat-value">{countWords(words)}</div>
  </div>
  <div class="stat">
    <div class="stat-title">Errors</div>
    <div class="stat-value">{countErrors(words)}</div>
  </div>
  <div class="stat">
    <div class="stat-title">Self Corrections</div>
    <div class="stat-value">{countSelfCorrections(words)}</div>
  </div>
  <div class="stat">
    <!-- Running Words – Total Errors = Score -->
    <div class="stat-title">Score</div>
    <div class="stat-value">{countWords(words) - countErrors(words)}</div>
  </div>
  <div class="stat">
    <!-- Score / Running Words / 100 = % Accuracy -->
    <div class="stat-title">Accuracy</div>
    <div class="stat-value">
      {getAccuracy(words)}%
    </div>
  </div>
</div>

<dl>
  <dt>Lexile</dt>
  <dd>{data.runningRecord?.lexile}L</dd>
  <dt>Determination</dt>
  <dd>{getDetermination(words)}</dd>
</dl>

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
    <Form action="?/update" id="raw-record-form" onSuccess={writeRawRecord}>
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
          on:change={updateRawRecord}
          name="marked_text"
        />
      </label>
    </Form>
  </div>
{/if}
