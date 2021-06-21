<script>
  import Card from './Card.svelte'
  let apps = [
    {
      icon: '/img/mojiparty.png',
      title: 'Mojiparty',
      description: 'An online multiplayer game where you compete against your friends to guess what emojis mean',
      url: 'https://www.mojiparty.io/'
    },
    {
      icon: '/img/simple-chat-app.png',
      title: 'Simple Chat App',
      description: 'Native javascript chat room application using socket.io',
      url: 'https://simple-chat-app-000.herokuapp.com/'
    },
    {
      icon: '/img/covid-19-dashboard.png',
      title: 'COVID-19 Dashboard',
      description: 'Dashboard which shows COVID-19 case data using React',
      url: 'https://josiahyeow.github.io/covid-19-dashboard/'
    },
    {
      icon: '/img/pocketlint.png',
      title: 'PocketLint',
      description: 'iOS app for capturing quick photo notes with text recognition written in Swift',
      url: 'https://github.com/josiahyeow/PocketLint'
    },
    {
      icon: '/img/flush.png',
      title: 'Flush',
      description: 'Gamified task tracking and scheduling app written in React Native',
      url: 'https://devpost.com/software/flush-d69mqj'
    }
  ]
</script>

<style>
  .showcase {
    background-color: #fd6065;
    padding: 4em clamp(2em, 4vw, 4em);
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
    <Card icon={app.icon} title={app.title} description={app.description} url={app.url}/>
    {/each}
  </div>
</div>
