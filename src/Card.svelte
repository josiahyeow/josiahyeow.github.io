<script>
  export let icon;
  export let name;
  export let description;
</script>
<style>
  .app-card {
    background-color: #fff;
    width: 12em;
    padding: 1em;
  }
  .app-image {
    width: 100%;
  }
</style>
<div class="app-card">
  <img class="app-image" src="{icon}" alt="" />
  <h2>{name}</h2>
  <p>{description}</p>
</div>
