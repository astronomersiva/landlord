const request = require('request');

module.exports = function getSongsList(keyArray) {
  // keyArray = ['books new', 'beach'], then the spaces should be converted to +
  const keysJoined = keyArray.join(' ').replace(' ', '+');
  const options = {
    method: 'GET',
    uri: `https://api.mixcloud.com/search/?type=cloudcast&q=${keysJoined}`,
  };

  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (err) {
        reject(new Error(err));
      }

      let song = {};
      if (body.data) {
        const songs = JSON.parse(body);
        const { data } = songs;
        const [first] = data;
        song = {
          name: first.name,
          thumbnail: first.pictures.medium_mobile,
          url: first.url,
        };
      }

      resolve(song);
    });
  });
};
