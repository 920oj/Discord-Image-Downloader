exports.getUrlList = (content) => {
  const pattern = /(https?:\/\/[\x21-\x7e]+)/g;
  const list = content.match(pattern);
  console.log(list);
  if (!list) {
    return false;
  }
  else {
    return list;
  }
}

exports.downloadImage = (url, options, file_name) => {
  const fs = require('fs');
  const axios = require('axios');
  return new Promise(async (resolve, reject) => {
    await axios.get(url, options).then(res => {
      fs.writeFileSync(file_name, res.data, 'binary');
      resolve();
    });
  })
}