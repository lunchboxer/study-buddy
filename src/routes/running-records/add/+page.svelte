<script>
import Error from '$lib/error.svelte'
export let data
let fontSize = 20

let mediaRecorder
let audioChunks = []
let audioUrl
let isRecording = false
let errorMessage = ''
let bitRate = 10_000
let recordingStartTime
let recordingDuration = 0
let fileSize = 0
let isUploading = false
let uploadStatus = ''

function formatFileSize(bytes) {
  if (bytes === 0) {
    return '0 Bytes'
  }
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const index = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** index).toFixed(2))} ${sizes[index]}`
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

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
    recordingStartTime = Date.now()

    mediaRecorder.addEventListener('dataavailable', event => {
      audioChunks.push(event.data)
    })

    mediaRecorder.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks, {
        type: 'audio/webm;codecs=opus',
      })
      audioUrl = URL.createObjectURL(audioBlob)
      fileSize = audioBlob.size
      recordingDuration = (Date.now() - recordingStartTime) / 1000 // Convert to seconds
      audioChunks = []
      isRecording = false
    })
  } catch (error) {
    console.error('Error accessing the microphone:', error)
    isRecording = false
    if (
      error.name === 'NotFoundError' ||
      error.name === 'DevicesNotFoundError'
    ) {
      errorMessage =
        'No microphone found. Please make sure a microphone is connected and try again.'
    } else if (
      error.name === 'NotAllowedError' ||
      error.name === 'PermissionDeniedError'
    ) {
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
function downloadAudio() {
  if (audioUrl) {
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = `runningrecord_${new Date().toISOString()}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
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
      text_id: data.text.id, // Assuming this is available in your data object
      comments: null,
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
</script>

<h1>Running Record for {data.student.name}</h1>

<div>
  {#if errorMessage}
    <Error errors={errorMessage} />
  {/if}
  <button class="btn btn-primary" on:click={startRecording} disabled={isRecording}>
    Start Recording
  </button>
  <button class="btn btn-secondary" on:click={stopRecording} disabled={!isRecording}>
    Stop Recording
  </button>
</div>

{#if audioUrl}
  <div>
    <h4>Recorded Audio</h4>
    <audio src={audioUrl} controls></audio>
    <button class="btn btn-primary" on:click={downloadAudio}>Download Recording</button>
    <button class="btn btn-success" on:click={uploadToCloudinary} disabled={isUploading}>
      Save Recording
    </button>
    {#if uploadStatus}
      <p>{uploadStatus}</p>
    {/if}
  </div>
{/if}

<h2>{data.text.title}</h2>

<pre class="bg-base-200" style="font-size: {fontSize}px;">{data.text.text}</pre>

<label for="font-size">
  Font Size:
  <button class="btn btn-ghost" on:click={() => (fontSize = fontSize * 0.8)}>-</button>
  <button class="btn btn-ghost" on:click={() => (fontSize = fontSize * 1.2)}>+</button>
</label>
