<script>
  import Card from './Card.svelte'
  let apps = [
    {
      icon: '/img/simple-chat-app.png',
      name: 'Simple Chat App',
      description: 'Native javascript chat room application using socket.io'
    },
    {
      icon: '/img/covid-19-dashboard.png',
      name: 'COVID-19 Dashboard',
      description: 'Dashboard which shows COVID-19 case data using React'
    },
    {
      icon: '/img/pocketlint.png',
      name: 'PocketLint',
      description: 'iOS app for capturing quick photo notes with text recognition written in Swift'
    },
    {
      icon: '/img/flush.png',
      name: 'Flush',
      description: 'Gamified task tracking and scheduling app written in React Native'
    }
  ]
</script>

<style>
  .showcase {
    background-color: #fd6065;
    padding: 4em;
  }
  h1 {
    color: #fff;
    margin-top: 0;
    margin-bottom: 2em;
  }
  .apps {
    display: grid;
    grid-gap: 4em;
    grid-template-columns: repeat(auto-fill, minmax(12em, 1fr));
  }
</style>
<div class="showcase">
  <h1>Some things I've created</h1>
  <div class="apps">
    {#each apps as app}
    <Card icon={app.icon} name={app.name} description={app.description}/>
    {/each}
  </div>
</div>
