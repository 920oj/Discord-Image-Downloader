require('dotenv').config();

const axios = require('axios');
const discord = require('discord.js');
const client = new discord.Client();

const tools = require('./lib/tools');
const pixiv = require('./lib/pixiv');

client.on('ready', () => {
  console.log('Discord-Image-Downloader by 920OJ');
  console.log(`${client.user.username}としてログインしました。`);
})

client.login(process.env.DSTOKEN);