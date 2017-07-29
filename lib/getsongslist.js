const request = require('request');

module.exports = function getSongsList(keyArray) {
  const keysJoined = keyArray.join('+');
  const options = {
    method: 'GET',
    uri: `https://api.mixcloud.com/search/?type=cloudcast&q=${keysJoined}`,
  };

  request(options, (err, response, body) => {
    if (err) throw new Error(err);

    if (body) {
      const songs = JSON.parse(body);
      const { data } = songs;
      const [first] = data;
      const song = {
        name: first.name,
        thumbnail: first.pictures.thumbnail,
        url: first.url,
      };

      return song;
    }

    return {};
  });
};
