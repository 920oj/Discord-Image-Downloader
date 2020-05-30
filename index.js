require('dotenv').config();

const discord = require('discord.js');
const client = new discord.Client();

client.on('ready', () => {
  console.log('Discord-Image-Downloader by 920OJ');
  console.log(`${client.user.username}としてログインしました。`);
})

client.login(process.env.DSTOKEN);