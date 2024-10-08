<script>
  import Error from '$lib/error.svelte'
  import Modal from '$lib/modal.svelte'

  export let data
  let fontSize = 20

  let mediaRecorder
  let audioChunks = []
  let audioUrl
  let isRecording = false
  let errorMessage = ''
  const bitRate = 12_000
  let isUploading = false
  let uploadStatus = ''
  let modal
  let allDone = false

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const options = {
        mimetype: 'audio/webm; codecs=opus',
        audioBitsPerSecond: bitRate,
      }
      mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorder.start()
      isRecording = true
      errorMessage = ''

      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data)
      })

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, {
          type: 'audio/webm;codecs=opus',
        })
        audioUrl = URL.createObjectURL(audioBlob)
        audioChunks = []
        isRecording = false
      })
    } catch (error) {
      console.error('Error accessing the microphone:', error)
      isRecording = false
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage =
          'No microphone found. Please make sure a microphone is connected and try again.'
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage =
          'Permission to use microphone was denied. Please allow microphone access and try again.'
      } else {
        errorMessage =
          'An error occurred while trying to access the microphone. Please check your settings and try again.'
      }
    }
  }

  function stopRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
    }
  }

  async function uploadToCloudinary() {
    if (!audioUrl) {
      return
    }

    isUploading = true
    uploadStatus = 'Uploading...'

    try {
      // Fetch the Blob from the audioURL
      const response = await fetch(audioUrl)
      const blob = await response.blob()

      // Create FormData
      const formData = new FormData()
      formData.append('file', blob, 'audio.webm')
      formData.append('api_key', data.apiKey)
      formData.append('signature', data.signature)
      formData.append('public_id', data.public_id)
      formData.append('timestamp', data.timestamp)
      formData.append('folder', data.folder)

      // Upload to Cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${data.cloudName}/auto/upload`,
        {
          method: 'POST',
          body: formData,
        },
      )

      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }

      const result = await uploadResponse.json()
      uploadStatus = 'Upload successful!'
      await createRunningRecord(result.url)
      allDone = true
    } catch (error) {
      console.error('Upload error:', error)
      uploadStatus = 'Upload failed. Please try again.'
    } finally {
      isUploading = false
    }
  }

  async function createRunningRecord(audioUrl) {
    uploadStatus = 'Creating running record...'
    try {
      const runningRecordData = {
        student_id: data.student.id,
        audio_url: audioUrl,
        marked_text: data.text.text,
        text_id: data.text.id,
      }

      const response = await fetch('/running-records/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runningRecordData),
      })

      if (!response.ok) {
        throw new Error('Failed to create running record')
      }

      const result = await response.json()
      if (result.success) {
        uploadStatus = 'Running record created successfully!'
      }
    } catch (error) {
      console.error('Error creating running record:', error)
      throw error // Re-throw to handle in the calling function
    }
  }

  function deleteAudio() {
    audioUrl = undefined
    audioChunks = []
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
    mediaRecorder = undefined
    isRecording = false
    uploadStatus = ''
    modal.close()
  }
  function cancelDelete() {
    modal.close()
  }
</script>

<h1>Running Record for {data.student.name}</h1>

{#if errorMessage}
  <Error errors={errorMessage} />
{/if}

{#if allDone}
  <h2 class="text-primary">All done!</h2>
{:else}
  {#if audioUrl}
    <h4>2. Listen to your recording.</h4>
    <audio src={audioUrl} controls></audio>
    <h4>3. What would you like to do?</h4>
    <button class="btn btn-error" onclick="confirmDeleteModal.showModal()">Delete recording</button>
    <button class="btn btn-success" on:click={uploadToCloudinary} disabled={isUploading}>
      Save Recording
    </button>
    {#if uploadStatus}
      <p>{uploadStatus}</p>
    {/if}
  {:else}
    <h4>1. Record yourself reading the text.</h4>
    <button class="btn btn-primary" on:click={startRecording} disabled={isRecording}>
      Start Recording
    </button>
    <button class="btn btn-secondary" on:click={stopRecording} disabled={!isRecording}>
      Stop Recording
    </button>
  {/if}

  <h2>{data.text.title}</h2>

  <pre class="bg-base-200" style="font-size: {fontSize}px;">{data.text.text}</pre>

  <label for="font-size">
    Font Size:
    <button class="btn btn-ghost" on:click={() => (fontSize = fontSize * 0.8)}>-</button>
    <button class="btn btn-ghost" on:click={() => (fontSize = fontSize * 1.2)}>+</button>
  </label>

  <Modal
    bind:modal
    id="confirmDeleteModal"
    heading="Confirm action"
    message="Really delete your recording and start over?"
  >
    <button class="btn btn-error" on:click={deleteAudio}>Yes. Delete it.</button>
    <button class="btn btn-success" on:click={cancelDelete}>No. Keep it.</button>
  </Modal>
{/if}
