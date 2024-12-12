<script>
  import AudioRecorder from '$lib/audio-recorder.svelte'

  export let data
  export let form
  const { wordsWithoutAudio } = data

  let currentWordIndex = 0
  let currentRecordingType = 'super-slow'

  $: currentWord = form?.signatures?.[currentWordIndex]
  $: currentSignature = currentWord?.recordings?.find((r) => r.type === currentRecordingType)
  $: isLastWord = form?.signatures && currentWordIndex === form.signatures.length - 1
  $: isLastRecording = currentRecordingType === 'normal'

  function nextRecording() {
    if (isLastRecording) {
      if (!isLastWord) {
        currentWordIndex++
        currentRecordingType = 'super-slow'
      }
    } else {
      currentRecordingType = currentRecordingType === 'super-slow' ? 'segmented' : 'normal'
    }
  }

  function handleRecordingComplete() {
    nextRecording()
  }
</script>

<svelte:window
  on:keydown={(event) => {
    if (event.code === 'Space') {
      if (isLastRecording) {
        if (!isLastWord) {
          currentWordIndex++
          currentRecordingType = 'super-slow'
        }
      } else {
        currentRecordingType = currentRecordingType === 'super-slow' ? 'segmented' : 'normal'
      }
    }
  }}
/>

<h1>Word Audio</h1>

{#if wordsWithoutAudio.length > 0 && !form?.success}
  <p class="text-lg">{wordsWithoutAudio.length} words need audio recordings</p>
  <form method="POST" action="?/prepareUpload">
    <button class="btn btn-primary" type="submit"> Add missing audio </button>
  </form>
{/if}

{#if form?.success && currentWord}
  <div class="max-w-xl mx-auto mt-8 p-4">
    <h2 class="text-2xl font-bold text-center mb-4">
      Word {currentWordIndex + 1} of {form.signatures.length}
    </h2>

    <AudioRecorder
      text={currentWord.word}
      recordingType={currentRecordingType}
      word_id={currentWord.wordId}
      cloudinaryParameters={{
        apiKey: form.apiKey,
        cloudName: form.cloudName,
        folder: form.folder,
        ...currentSignature,
      }}
      onRecordingComplete={handleRecordingComplete}
    />
  </div>
{/if}
