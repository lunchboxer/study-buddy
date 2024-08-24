<script>
  import BookIcon from '$lib/icons/book-icon.svelte'
  import { page } from '$app/stores'

  export let me
</script>

<div class="big-logo hidden lg:block py-8 text-center">
  <a href="/" class="btn btn-ghost text-xl text-primary">
    <BookIcon size="20" />
    Study Buddy
    <div></div>
  </a>
</div>

<div class="hidden lg:block">
  <div class="divider">Navigation</div>
</div>
<li><a href="/school-years">School years</a></li>
<li><a href="/groups">Groups</a></li>
<li><a href="/subjects">Subjects</a></li>
<li><a href="/students">Students</a></li>
<li><a href="/assignments">Assignments</a></li>
<li><a href="/running-records">Running records</a></li>
<li><a href="/running-record-texts">Running record texts</a></li>
<li><a href="/users">Users</a></li>
<li><a href="/roles">Roles</a></li>

<br />
<div class="divider">{me?.username}</div>
{#if $page.url.pathname !== '/logout'}
  <li>
    <button onclick="logoutmodal.showModal()">Log out</button>
  </li>
{/if}
{#if $page.url.pathname !== '/profile'}
  <li>
    <a href="/profile">User Profile</a>
  </li>
{/if}
