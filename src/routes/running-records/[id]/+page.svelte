<script>
import { dateToLocal } from '$lib/utils'
import TextArea from '$lib/text-area.svelte'
import Form from '$lib/form.svelte'
import WordToMark from '$lib/word-to-mark.svelte'
import { page } from '$app/stores'

export let data

let words = data.runningRecord?.marked_text.split(/\s+/)

const markAll = async type => {
  let all = ''
  if (type === 'unmarkAll') {
    all = data.runningRecord?.marked_text.replace(/\[\/?[a-z]+\]/gm, '')
    words = all.split(/\s+/)
  }
  if (type === 'allAccurate') {
    words = data.runningRecord?.marked_text.split(/\s+/)
    for (let i = 0; i < words.length; i++) {
      words[i] =
        `[accurate]${words[i].replace(/\[\/?[a-z]+\]/gm, '')}[/accurate]`
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
</script>

<h1>Running Record for {data.runningRecord?.student_name}</h1>

<p>{dateToLocal(data.runningRecord?.created)}</p>

<audio controls src={data.runningRecord?.audio_url}>
  Your browser does not support the
  <code>audio</code> element.
</audio>

<h2>{data.runningRecord?.text_title}</h2>

<div style="font-size: 1.4rem; line-height: 2; cursor: pointer;">
  {#each words as word, index}
    <WordToMark {word} {index} />
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

<Form action="?/update">
  <TextArea label="Comments" data={data.runningRecord} name="comments" />
</Form>
