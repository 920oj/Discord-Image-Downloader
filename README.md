# Discord Image Downloader

## 概要
DIscordの任意のチャンネル上に送信された、Twitter及びPixivの画像をローカルにダウンロードします。

## セットアップ
### 導入
```
git clone https://github.com/920oj/Discord-Image-Downloader.git
cd Discord-Image-Downloader
yarn install
```

### `.env`ファイルの作成
```
touch .env
```

`.env`ファイル
```
TW_CK=Twitterのconsumer_key
TW_CS=Twitterのconsumer_secret
TW_TK=TwitterのAccess Token Key
TW_TS=TwitterのAccess Token Secret
DSTOKEN=DiscordのBot Token
CH=稼働させるチャンネルを指定（半角スペースで複数指定）
```

## LICENSE
MIT License