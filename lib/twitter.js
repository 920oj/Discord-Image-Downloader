exports.parseTweetId = (url) => {
  const tweet_id = new URL(url).pathname.split('/').splice(-1)[0];
  if (tweet_id) return tweet_id;
  else return false;
}

exports.getTweetInfo = (id, client) => {
  return new Promise((resolve, reject) => {
    client.get('statuses/show', { id: id })
      .then((tweet) => {
        resolve(tweet);
      })
      .catch((err) => {
        reject(err);
      })
  })
}

exports.parseTweetData = (tweet_info) => {
  let twitter_image_data = [];
  tweet_info.extended_entities.media.forEach((e) => {
    const image_ex = e.media_url_https.slice(-3);
    const image_url = `${e.media_url_https.replace(`.${image_ex}`, '')}?format=${image_ex}&name=orig`
    const tmp = {
      extention: image_ex,
      url: image_url
    }
    twitter_image_data.push(tmp);
  })
  return twitter_image_data;
}

exports.twitterDwonloader = async (twitter_image_data, tweet_id, channel_id) => {
  const fs = require('fs');
  const tools = require('./tools');
  return new Promise(async (resolve, reject) => {
    const options = {
      responseType: 'arraybuffer',
    };
    if (twitter_image_data.length > 1) {
      if (!fs.existsSync(`./dl/${channel_id}/${tweet_id}/`)) {
        fs.mkdirSync(`./dl/${channel_id}/${tweet_id}/`);
      };
      for (let i in twitter_image_data) {
        const file_name = `./dl/${channel_id}/${tweet_id}/${i}_${new URL(twitter_image_data[i].url).pathname.split('/').splice(-1)[0]}.${twitter_image_data[i].extention}`;
        await tools.downloadImage(twitter_image_data[i].url, options, file_name)
          .then(() => {
            console.log(`${twitter_image_data[i].url}のダウンロードを完了しました。`);
          })
          .catch(() => {
            console.log(`${twitter_image_data.url}のダウンロードに失敗しました。`);
          })
      }
      resolve();
    }
    else if (twitter_image_data.length === 1) {
      const file_name = `./dl/${channel_id}/${new URL(twitter_image_data[0].url).pathname.split('/').splice(-1)[0]}.${twitter_image_data[0].extention}`;
      await tools.downloadImage(twitter_image_data[0].url, options, file_name)
        .then(() => {
          console.log(`${twitter_image_data[0].url}のダウンロードを完了しました。`);
          resolve();
        })
        .catch(() => {
          console.log(`${twitter_image_data[0].url}のダウンロードに失敗しました。`);
          resolve();
        })
    }
    else {
      reject();
    }
  })
}