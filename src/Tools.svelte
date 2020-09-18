<script>
  const frontend = [
    { name: "React", color: "#61dafb" },
    { name: "Svelte", color: "#ff3e00" },
    { name: "Angular", color: "#dd0031" },
    { name: "Swift", color: "#f53f25" },
    { name: "React Native", color: "#61dafb" },
  ];
  const backend = [
    { name: "Node", color: "#026e00" },
    { name: "Express", color: "#259dff" },
    { name: "Socket.IO", color: "#010101" },
    { name: "Python", color: "#ffdc68" },
  ];
  const devops = [
    { name: "Docker", color: "#0073ec" },
    { name: "Jenkins", color: "#d33833" },
    { name: "AWS", color: "#ec912d" },
    { name: "Firebase", color: "#ffcb2b" },
  ];
</script>

<style>
  .tools {
    padding: 4em;
  }
  h1 {
    margin-top: 0;
    margin-bottom: 2em;
  }
  @media (max-width: 600px) {
    .tools {
      padding: 4em 2em;
    }
  }
  li {
    display: flex;
    align-items: center;
    background-color: #f5f5f7;
    padding: 1em;
    border-radius: 1em;
  }
  ul {
    list-style: none;
    padding: 0;
    display: grid;
    grid-gap: 2em;
    grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
  }
  section {
    margin-bottom: 4em;
  }
  .color {
    padding: 1em;
    border-radius: 0.5em;
    margin-right: 1em;
  }
</style>
<div class="tools">
  <h1>Some things I've worked with</h1>
  <section>
    <h3>Frontend</h3>
    <ul>
      {#each frontend as tool}
      <li>
        <div class="color" style="background-color: {tool.color}"></div>
        {tool.name}
      </li>
      {/each}
    </ul>
  </section>
  <h3>Backend</h3>
  <section>
    <ul>
      {#each backend as tool}
      <li>
        <div class="color" style="background-color: {tool.color}"></div>
        {tool.name}
      </li>
      {/each}
    </ul>
  </section>
  <h3>DevOps</h3>
  <section>
    <ul>
      {#each devops as tool}
      <li>
        <div class="color" style="background-color: {tool.color}"></div>
        {tool.name}
      </li>
      {/each}
    </ul>
  </section>
</div>
