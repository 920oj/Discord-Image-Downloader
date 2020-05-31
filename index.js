require('dotenv').config();

const fs = require('fs');

const discord = require('discord.js');
const client = new discord.Client();

const tw = require('twitter');
const tw_client = new tw({
  consumer_key: process.env.TW_CK,
  consumer_secret: process.env.TW_CS,
  access_token_key: process.env.TW_TK,
  access_token_secret: process.env.TW_TS
})

const tools = require('./lib/tools');
const twitter = require('./lib/twitter');
const pixiv = require('./lib/pixiv');

const channel = process.env.CH.split(' ');

client.on('ready', () => {
  if (!fs.existsSync('./dl/')) fs.mkdirSync('./dl/');
  channel.forEach((e) => { if (!fs.existsSync(`./dl/${e}/`)) fs.mkdirSync(`./dl/${e}/`); });

  console.log('Discord-Image-Downloader');
  console.log(`${client.user.username}としてログインしました。`);
})

client.on('message', async msg => {
  if (msg.author.bot === false) {
    if (channel.indexOf(msg.channel.id) != -1) {
      const url_list = tools.getUrlList(msg.content);
      if (url_list) {
        for (let e of url_list) {
          if (e.indexOf('twitter.com') != -1) { // リンクがTwitterだった時の処理 
            const tweet_id = twitter.parseTweetId(e);
            const tweet_info = await twitter.getTweetInfo(tweet_id, tw_client);
            if (tweet_info.extended_entities) {
              if (tweet_info.extended_entities.media[0].type === 'photo') {
                const tweet_image_data = twitter.parseTweetData(tweet_info);
                await twitter.twitterDwonloader(tweet_image_data, tweet_id, msg.channel.id)
                  .then(() => {
                    msg.react('👌');
                  })
                  .catch(() => {
                    msg.react('❌');
                  })
              }
            }
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