require('dotenv').config();

const fs = require('fs');
const discord = require('discord.js');
const client = new discord.Client();

const tools = require('./lib/tools');
const pixiv = require('./lib/pixiv');

const channel = process.env.CH.split(' ');

client.on('ready', () => {
  if (!fs.existsSync('./dl/')) {
    fs.mkdirSync('./dl/');
  };
  console.log('Discord-Image-Downloader by 920OJ');
  console.log(`${client.user.username}としてログインしました。`);
})

client.on('message', async msg => {
  if (msg.author.bot === false) {
    if (channel.indexOf(msg.channel.id) != -1) {
      const url_list = tools.getUrlList(msg.content);
      if (url_list) {
        url_list.forEach(async e => {
          if (e.indexOf('twitter.com') != -1) { // リンクがTwitterだった時の処理 

          }
          else if (e.indexOf('pixiv.net') != -1) { // リンクがPixivだった時の処理
            const pixiv_dl_info = await pixiv.pixivImgParser(e);
            const illust_id = pixiv_dl_info.id;

            if (pixiv_dl_info.urls.length > 1) {
              if (!fs.existsSync(`./dl/${illust_id}/`)) {
                fs.mkdirSync(`./dl/${illust_id}/`);
              };
              pixiv_dl_info.urls.forEach(async url => {
                const pixiv_options = {
                  headers: {
                    'referer': `https://www.pixiv.net/artworks/${illust_id}`,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
                  },
                  responseType: 'arraybuffer'
                };
                const file_name = new URL(url).pathname.split('/').slice(-1)[0];
                await tools.downloadImage(url, pixiv_options, `./dl/${illust_id}/${file_name}`);
              });
            }
            else if (pixiv_dl_info.urls.length === 1) {
              const pixiv_options = {
                headers: {
                  'referer': `https://www.pixiv.net/artworks/${illust_id}`,
                  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
                },
                responseType: 'arraybuffer'
              };
              const file_name = new URL(pixiv_dl_info.urls[0]).pathname.split('/').slice(-1)[0];
              await tools.downloadImage(pixiv_dl_info.urls[0], pixiv_options, `./dl/${file_name}`);
            }
            else {

            }
          }
        });
      }
    }
  }
})

client.login(process.env.DSTOKEN);