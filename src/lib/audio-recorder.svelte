<script>
  import Fa from 'svelte-fa'
  import { faPlay, faStop, faMicrophone } from '@fortawesome/free-solid-svg-icons'
  import { notifications } from '$lib/notifications/notifications-store.js'

  export let text
  export let recordingType = ''
  export let cloudinaryParameters
  export let word_id
  export let onRecordingComplete

  let mediaRecorder
  let recordingState = 'idle' // idle, recording, processing
  let audioBlob
  let audioUrl
  let uploadStatus = { 'super-slow': false, segmented: false, normal: false }

  console.log(word_id)

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioOptions = {
        mimetype: 'audio/webm; codecs=opus',
        channelCount: 1,
        audioBitsPerSecond: 48_000,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      }
      mediaRecorder = new MediaRecorder(stream, audioOptions)
      const chunks = []

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        audioBlob = new Blob(chunks, { type: 'audio/opus' })
        audioUrl = URL.createObjectURL(audioBlob)
        recordingState = 'idle'
      }

      recordingState = 'recording'
      mediaRecorder.start()
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please ensure it is connected and permitted.')
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      for (const track of mediaRecorder.stream.getTracks()) track.stop()
    }
  }

  async function uploadRecording() {
    if (!audioBlob || !cloudinaryParameters) return

    recordingState = 'processing'
    const formData = new FormData()
    formData.append('file', audioBlob)
    formData.append('api_key', cloudinaryParameters.apiKey)
    formData.append('timestamp', cloudinaryParameters.timestamp)
    formData.append('signature', cloudinaryParameters.signature)
    formData.append('public_id', cloudinaryParameters.public_id)
    formData.append('folder', cloudinaryParameters.folder)

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryParameters.cloudName}/video/upload`,
        {
          method: 'POST',
          body: formData,
        },
      )

      if (!response.ok) throw new Error('Upload failed')

      const result = await response.json()
      console.log(result)
      onRecordingComplete(result)
      audioBlob = undefined

      notifications.add({
        text: 'Recording uploaded successfully!',
        type: 'success',
      })

      const formActionData = {
        word_id,
        audio_url: result.secure_url,
        type: recordingType,
      }

      // Use the form action to save the audio record
      const formActionResponse = await fetch('/words/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formActionData),
      })

      if (!formActionResponse.ok) {
        throw new Error('Failed to save audio record')
      }

      // Mark the current recording type as uploaded
      uploadStatus[recordingType] = true

      // Reset for the next recording type
      if (recordingType === 'super-slow') {
        recordingType = 'segmented'
      } else if (recordingType === 'segmented') {
        recordingType = 'normal'
      } else {
        uploadStatus = { 'super-slow': false, segmented: false, normal: false }
      }
    } catch (error) {
      console.error('Upload error:', error)
      notifications.add({
        text: 'Failed to upload recording. Please try again.',
        type: 'error',
      })
    } finally {
      recordingState = 'idle'
    }
  }
</script>

<div class="steps w-full mb-4">
  <div class="step" class:step-success={uploadStatus['super-slow']}>Super Slow</div>
  <div class="step" class:step-success={uploadStatus.segmented}>Segmented</div>
  <div class="step" class:step-success={uploadStatus.normal}>Normal</div>
</div>

<div class="flex flex-col items-center gap-4">
  <div class="text-center mb-4">
    <div class="text-4xl font-bold mb-2">{text}</div>
    {#if recordingType}
      <div class="text-lg text-gray-600">Recording type: {recordingType}</div>
    {/if}
  </div>

  {#if recordingState === 'recording'}
    <div class="text-red-600 text-2xl mb-4 animate-pulse">Recording...</div>
  {/if}

  {#if audioBlob}
    <audio src={audioUrl} controls class="w-full mb-4" />
    <div class="flex gap-4">
      <button
        class="btn btn-primary"
        class:loading={recordingState === 'processing'}
        on:click={uploadRecording}
      >
        {#if recordingState === 'processing'}
          <Fa icon={faPlay} /> Uploading...
        {:else}
          <Fa icon={faPlay} /> Upload and continue
        {/if}
      </button>
      <button
        class="btn"
        on:click={() => {
          audioBlob = undefined
          audioUrl = undefined
        }}
      >
        Discard and re-record
      </button>
    </div>
  {:else}
    <button
      class="btn btn-primary"
      on:click={recordingState === 'recording' ? stopRecording : startRecording}
    >
      {#if recordingState === 'recording'}
        <Fa icon={faStop} /> Stop Recording
      {:else}
        <Fa icon={faMicrophone} /> Start Recording
      {/if}
    </button>
  {/if}
</div>
