<script>
  import { dateToLocal } from '$lib/utils'
  import TextArea from '$lib/text-area.svelte'
  import Form from '$lib/form.svelte'
  import WordToMark from '$lib/word-to-mark.svelte'
  import { page } from '$app/stores'
  import DeleteModal from '$lib/delete-modal.svelte'

  export let data

  let words = data.runningRecord?.marked_text.split(/\s+/)

  const markAll = async (type) => {
    let all = ''
    if (type === 'unmarkAll') {
      all = data.runningRecord?.marked_text.replace(/\[\/?[a-z-]+\]/gm, '')
      words = all.split(/\s+/).filter((word) => !word.startsWith('[insertion]'))
    }
    if (type === 'allAccurate') {
      words = data.runningRecord?.marked_text
        .split(/\s+/)
        .filter((word) => !word.startsWith('[insertion]'))
      for (let i = 0; i < words.length; i++) {
        words[i] = `[accurate]${words[i].replace(/\[\/?[a-z-]+\]/gm, '')}[/accurate]`
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

  // count the number of items in the array which start with `[omission]` `[substitution]` `[repetition]` or `[insertion]`
  const getErrors = (words) => {
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
  const getSelfCorrections = (words) => {
    let selfCorrections = 0
    for (const word of words) {
      if (word.startsWith('[self-correction]')) {
        selfCorrections++
      }
    }
    return selfCorrections
  }
  const getAccuracy = (words) =>
    Math.round(((words.length - getErrors(words)) / words.length) * 100)
  const getDetermination = (words) => {
    const accuracy = getAccuracy(words)
    if (accuracy > 96) {
      return 'Easy: Consider advancement'
    }
    if (accuracy > 93) {
      return 'Appropriate instructional text'
    }
    if (accuracy >= 90) {
      return 'Challenging: may need support'
    } else {
      return 'Difficult: consider lower level'
    }
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
    <div class="stat-value">{words.length}</div>
  </div>
  <div class="stat">
    <div class="stat-title">Errors</div>
    <div class="stat-value">{getErrors(words)}</div>
  </div>
  <div class="stat">
    <div class="stat-title">Self Corrections</div>
    <div class="stat-value">{getSelfCorrections(words)}</div>
  </div>
  <div class="stat">
    <!-- Running Words – Total Errors = Score -->
    <div class="stat-title">Score</div>
    <div class="stat-value">{words.length - getErrors(words)}</div>
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

<Form action="?/updateComment">
  <TextArea label="Comments" data={data.runningRecord} name="comments" />
</Form>

<br />

<DeleteModal thing={data.runningRecord} thingName="running record" />
