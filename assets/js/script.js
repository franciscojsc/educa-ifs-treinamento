const root = document.getElementById('root');

fetch('db.json')
  .then((response) => response.text())
  .then((text) => {
    const usersGithub = JSON.parse(text);
    const cardBody = usersGithub.users
      .reverse()
      .map((user) => {
        return `<div class="card-github">
      <div class="card-content">
        <img class="github-avatar"
          src="${user.avatar}"
          alt="Imagem do usuário ${user.name} do GitHub ">
        <p class="github-username">
          <a href="https://github.com/${user.nick}">@${user.nick}</a>
        </p>
      </div>
    </div>`;
      })
      .join('');

    root.insertAdjacentHTML('beforeend', cardBody);
  });
