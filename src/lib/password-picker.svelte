<script>
  import PasswordButton from '$lib/password-button.svelte'
  import {
    faFrog,
    faBed,
    faLightbulb,
    faSnowflake,
    faBone,
    faIceCream,
    faFishFins,
    faHotdog,
    faPizzaSlice,
    faBuilding,
    faCat,
    faCrow,
    faBell,
    faDog,
    faHippo,
    faTableTennisPaddleBall,
  } from '@fortawesome/free-solid-svg-icons'

  export let password = []

  const passwordOptions = [
    { icon: faFrog, text: 'frog' },
    { icon: faCat, text: 'cat' },
    { icon: faCrow, text: 'crow' },
    { icon: faBell, text: 'bell' },
    { icon: faBuilding, text: 'building' },
    { icon: faTableTennisPaddleBall, text: 'pingpong' },
    { icon: faDog, text: 'dog' },
    { icon: faHippo, text: 'hippo' },
    { icon: faHotdog, text: 'hotdog' },
    { icon: faFishFins, text: 'fish' },
    { icon: faBone, text: 'bone' },
    { icon: faIceCream, text: 'icecream' },
    { icon: faLightbulb, text: 'light' },
    { icon: faPizzaSlice, text: 'pizza' },
    { icon: faBed, text: 'bed' },
    { icon: faSnowflake, text: 'snow' },
  ]

  function handleSelection(text) {
    password = password.includes(text)
      ? password.filter((item) => item !== text)
      : [...password, text]
  }
  $: console.log(password)
</script>

<div class="grid grid-cols-4 gap-4">
  {#each passwordOptions as { icon, text }}
    <PasswordButton on:click={() => handleSelection(text)} {icon} {text} {password} />
  {/each}
</div>
