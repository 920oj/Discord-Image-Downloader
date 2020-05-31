exports.getUrlList = (content) => {
  const pattern = /(https?:\/\/[\x21-\x7e]+)/g;
  const list = content.match(pattern);
  if (list) return list;
  return false;
}

exports.downloadImage = (url, options, file_name) => {
  const fs = require('fs');
  const axios = require('axios');
  return new Promise(async (resolve, reject) => {
    await axios.get(url, options)
      .then(res => {
        fs.writeFileSync(file_name, res.data, 'binary');
        resolve();
      })
      .catch(err => {
        console.log(err.response.status);
        reject();
      })
  })
}