const { writeFile, readFile } = require('fs');
const { promisify } = require('util');
const https = require('https');

const readFilePromisify = promisify(readFile);
const writeFilePromisify = promisify(writeFile);

function getDataUserGithub(name) {
  const options = {
    hostname: 'api.github.com',
    port: 443,
    path: `/users/${name}`,
    method: 'GET',
    headers: { 'user-agent': 'node.js' },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const data = [];

      res.on('data', (chunk) => {
        data.push(chunk);
      });

      res.on('end', () => resolve(Buffer.concat(data).toString()));
    });

    req.on('error', reject);

    req.end();
  });
}

const init = async () => {
  try {
    const Json = await readFilePromisify('./db.json');
    const Text = await readFilePromisify('./contribuidores.txt');

    const contentJson = JSON.parse(String(Json));
    const contentText = String(Text)
      .split('\n')
      .filter((item) => {
        return !!item;
      });

    const qtdContentJson = contentJson.users.length;
    const qtdContentText = contentText.length;

    if (qtdContentJson !== qtdContentText) {
      const nicks = contentJson.users.map((u) => u.nick);

      const difference = contentText.filter((item) => {
        return nicks.indexOf(item) == -1 ? item : false;
      });

      difference.forEach(async (user) => {
        let response = await getDataUserGithub(user);
        let { login, name, avatar_url } = JSON.parse(response);

        contentJson.users.push({
          nick: login,
          name: !!name ? name : login,
          avatar: avatar_url,
        });

        await writeFilePromisify('./db.json', JSON.stringify(contentJson));
      });
    }
  } catch (error) {
    console.error(error);
  }
};

init();
