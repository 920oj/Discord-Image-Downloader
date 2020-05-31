require('dotenv').config();

const fs = require('fs');
const discord = require('discord.js');
const client = new discord.Client();

const tools = require('./lib/tools');
const pixiv = require('./lib/pixiv');

const channel = process.env.CH.split(' ');

client.on('ready', () => {
  if (!fs.existsSync('./dl/')) fs.mkdirSync('./dl/');
  channel.forEach((e) => { if (!fs.existsSync(`./dl/${e}/`)) fs.mkdirSync(`./dl/${e}/`); });

  console.log('Discord-Image-Downloader by 920OJ');
  console.log(`${client.user.username}としてログインしました。`);
})

client.on('message', async msg => {
  if (msg.author.bot === false) {
    if (channel.indexOf(msg.channel.id) != -1) {
      const url_list = tools.getUrlList(msg.content);
      if (url_list) {
        for (let e of url_list) {
          if (e.indexOf('twitter.com') != -1) { // リンクがTwitterだった時の処理 

          }
          else if (e.indexOf('pixiv.net') != -1 && e.indexOf('artworks') != -1) { // リンクがPixivだった時の処理
            await pixiv.pixivImgParser(e)
              .then(async (urls) => {
                await pixiv.pixivDownloader(urls, msg.channel.id)
                  .then(() => {
                    msg.react('👌');
                  })
                  .catch(() => {
                    msg.react('❌');
                  });
              })
              .catch(() => {
                console.log('URL解析失敗');
                msg.react('❓');
              });
          }
        };
      }
    }
  }
})

client.login(process.env.DSTOKEN);