## Genius Lyrics Bot

GeniusLyricsBot library source code : [Github](https://github.com/OhYoonHee/genius-lyrics-bot/blob/main/core) or [GAS IDE](https://script.google.com/home/projects/1qwheRVgESInU2H6zZyuK0-Mfu6cWXF3Kx4LH5bjHuQYtowhwHFrKPvGE/edit)

## How to use?
* First add library lumpia and GeniusLyricsBot
    - lumpia: `1Yo6vQRwjG5Gl9jeEF0g2tBTUa0XN5MyT4G_HeDpRr9DvabxhRcSdhPNj`
    - GeniusLyricsBot: `1pIILo5YhzgcGMH2j8tLTEBmK-hf_Vv0W6wsL0YCQXAT6BrvgaK3F9Uld` -> always use latest version
* create `code.gs` file and write like this
```js
const OWNER_ID = 123; // <-- fill you telegram user id
GeniusLyricsBot.BOT_USERNAME = "SD_GeniusLyricsBot"; // <-- fill you telegram bot username
const BOT_TOKEN = "YOUR_BOT_TOKEN"; // <-- fill you telegram bot token, get it at @BotFather
const bot = new lumpia.init(BOT_TOKEN);

bot.use(GeniusLyricsBot.middleware);
```
* create `deploy.gs` file and write like this
```js
const WEBHOOK_URL = "" // <-- fill deploy url later
// run after you get webhook url
function setWebhook() {
  return Logger.log(bot.telegram.setWebhook(WEBHOOK_URL));
}

// do not run this function
function doPost(e) {
    try {
        bot.doPost(e);
    } catch(e) {
        bot.telegram.sendMessage(OWNER_ID, e.message);
    }
}

// run one times
function setBotComand() {
  const commands = [
    {
      command: "start",
      description: "🔅 Start the bot"
    }
  ];
  const result = bot.telegram.setMyCommands(commands);
  Logger.log(result);
}
```
* Deploy and get webhook url
* Fill `WEBHOOK_URL` variable at `deploy.gs` file, and run `setWebhook` function
* Run `setBotCommand` function
* Finish and bot ready to use.

## GeniusLyricsBot variable
There 4 config variable you can edit if you want:
* `BOT_USERNAME` = Your bot username, default `BOT_USERNAME` (type string)
* `CHANNEL_UPDATE` = Your channel update username, default `TarianaChannel` (type string)
* `BOT_GROUP` = Your support group username, default `TarianaBicara` (type string)
* `STICKER_FILE_ID` = If you want bot send sticker in start command fill this value with sticker file_id, default `false` (type boolean|string)

Example edit variable:
```js
GeniusLyricsBot.CHANNEL_UPDATE = "TarianaChannel";
```

## How to get sticker file_id ?
* Send `/file_id` command with reply a sticker.

## Any question ?
Send you question in [TarianaBicara Group](https://t.me/TarianaBicara)
