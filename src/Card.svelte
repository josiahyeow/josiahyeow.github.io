<script>
  export let icon;
  export let title;
  export let description;
  export let url;
</script>
<style>
  a {
    text-decoration: none;
    color: #000;
  }
  .app-card {
    background-color: #fff;
    width: 13em;
    padding: 1em;
    border-radius: 1em;
    -webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .app-card:hover {
    box-shadow: 0px 4px 64px -32px rgba(138, 54, 56, 1);
    -webkit-transform: scale(1.02, 1.02);
    transform: scale(1.02, 1.02);
  }
  .header {
    display: flex;
    align-items: center;
  }
  h3 {
    margin-top: 0;
  }
  .app-image {
    border-radius: 1em;
    width: 40%;
    height: 40%;
    margin-right: 1em;
  }
  @media (max-width: 600px) {
    .app-card {
      width: auto;
    }
  }
</style>
<div class="app-card shadow">
  <a href="{url}" target="_blank">
    <div class="header">
      <img class="app-image" src="{icon}" alt="" />
      <h3>{title}</h3>
    </div>
    <p>{description}</p>
  </a>
</div>
