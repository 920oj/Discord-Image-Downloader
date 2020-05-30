exports.pixivImgParser = (e) => {
  return new Promise(async (resolve, reject) => {
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
    if (illust_info.body.pageCount > 1) { // 漫画だった時の処理
      console.log('漫画です');
      const res = await axios.get(`https://www.pixiv.net/ajax/illust/${illust_id}/pages`, options);
      const page_info = res.data;
      const url_list = [];
      page_info.body.forEach(e => {
        url_list.push(e.urls.original);
      });
      resolve({
        urls: url_list,
        title: page_info.body.illustTitle,
        id: illust_id,
      });
    }
    else if (illust_info.body.pageCount == 1) { // イラストだった時の処理
      console.log('イラストです');
      resolve({
        urls: [illust_info.body.urls.original],
        title: illust_info.body.illustTitle,
        id: illust_id,
      });
    }
    else {
      console.log('URLの解析に失敗しました。');
      resolve(false);
    }
  });
}