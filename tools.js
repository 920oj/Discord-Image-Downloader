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

exports.pixivDownload = async (e) => {
  const axios = require('axios');
  const url = new URL(e);
  const illust_id = url.pathname.replace('/artworks/', '');
  const options = {
    headers: {
      'referer': `https://www.pixiv.net/artworks/${illust_id}`,
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
    }
  };
  const res = await axios.get(`https://www.pixiv.net/ajax/illust/${illust_id}?lang=ja`, options);
  const illust_info = res.data;
  if (illust_info.body.pageCount > 1) {
    const res = await axios.get(`https://www.pixiv.net/ajax/illust/${illust_id}/pages`, options);
    const page_info = res.data;
    const url_list = [];
    page_info.body.forEach(e => {
      url_list.push(e.urls.original);
    })
    console.log(url_list);
  }
  else {
    const illust_original_url = illust_info.body.urls.original;
    const file_name =
      console.log(illust_original_url);
    await this.imageDownload(illust_original_url, `https://www.pixiv.net/artworks/${illust_id}`);
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
      fs.writeFileSync('test.png', res.data, 'binary');
      resolve();
    });
  })
}