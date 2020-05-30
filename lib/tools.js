exports.getUrlList = (content) => {
  const pattern = /(https?:\/\/[\x21-\x7e]+)/g;
  const list = content.match(pattern);
  if (!list) {
    return false;
  }
  else {
    return list;
  }
}

exports.imageDownload = (url, referer, file_name) => {
  const fs = require('fs');
  const axios = require('axios');

  if (!fs.existsSync('./dl/')) {
    fs.mkdirSync('./dl/');
  };
  const options = {
    headers: {
      'referer': referer,
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
    },
    responseType: 'arraybuffer'
  };

  return new Promise(async (resolve, reject) => {
    await axios.get(url, options).then(res => {
      fs.writeFileSync(`./dl/${file_name}`, res.data, 'binary');
      resolve();
    });
  })
}