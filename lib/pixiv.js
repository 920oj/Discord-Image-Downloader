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
      if (illust_info.body.xRestrict === 1) {
        const page_count = illust_info.body.pageCount;
        const base_path = illust_info.body.urls.original.replace(illust_info.body.urls.original.split('/').splice(-1)[0], '');
        const url_list = [];
        for (let i = 0; i < page_count; i++) {
          const tmp_jpg = `${base_path}${illust_id}_p${i}.jpg`;
          const tmp_png = `${base_path}${illust_id}_p${i}.png`;
          url_list.push(tmp_jpg);
          url_list.push(tmp_png);
        }
        resolve({
          urls: url_list,
          title: illust_info.body.illustTitle,
          id: illust_id
        });
      }
      else if (illust_info.body.xRestrict === 0) {
        const res = await axios.get(`https://www.pixiv.net/ajax/illust/${illust_id}/pages`, options);
        const page_info = res.data;
        const url_list = [];
        page_info.body.forEach(e => {
          url_list.push(e.urls.original);
        });
        resolve({
          urls: url_list,
          title: illust_info.body.illustTitle,
          id: illust_id,
        });
      }
    }
    else if (illust_info.body.pageCount == 1) { // イラストだった時の処理
      resolve({
        urls: [illust_info.body.urls.original],
        title: illust_info.body.illustTitle,
        id: illust_id,
      });
    }
    else {
      reject();
    }
  });
};

exports.pixivDownloader = async (illust_data, channel_id) => {
  return new Promise(async (resolve, reject) => {
    const fs = require('fs');
    const tools = require('./tools');

    const illust_id = illust_data.id;

    if (illust_data.urls.length > 1) { // 漫画だったときの処理
      if (!fs.existsSync(`./dl/${channel_id}/${illust_id}/`)) {
        fs.mkdirSync(`./dl/${channel_id}/${illust_id}/`);
      };
      for (let url of illust_data.urls) {
        const pixiv_options = {
          headers: {
            'referer': `https://www.pixiv.net/artworks/${illust_id}`,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          },
          responseType: 'arraybuffer'
        };
        const file_name = new URL(url).pathname.split('/').slice(-1)[0];
        await tools.downloadImage(url, pixiv_options, `./dl/${channel_id}/${illust_id}/${file_name}`)
          .then(() => {
            console.log(`${url}をダウンロード完了`);
          })
          .catch(() => {
            console.log(`${url}のダウンロードに失敗しました`);
          })
      };
      resolve();
    }
    else if (illust_data.urls.length === 1) { // イラストだった時の処理
      const pixiv_options = {
        headers: {
          'referer': `https://www.pixiv.net/artworks/${illust_id}`,
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
        },
        responseType: 'arraybuffer'
      };
      const file_name = new URL(illust_data.urls[0]).pathname.split('/').slice(-1)[0];
      await tools.downloadImage(illust_data.urls[0], pixiv_options, `./dl/${channel_id}/${file_name}`)
        .then(() => {
          console.log(`${illust_data.urls[0]}のダウンロード完了`);
        })
        .catch(() => {
          console.log(`${illust_data.urls[0]}のダウンロードに失敗しました`);
        })
      resolve();
    }
    else { // 例外処理
      reject();
    }
  });
}