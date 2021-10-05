/**
 * requirements library:
 * Cheerio: 1ReeQ6WO8kKNxoaA_O0XEQ589cIrRvEBA9qcWpNqdOP17i47u6N9M5Xh0 #v13
 * bapia: 1OSN8eNlJtw2ehf3ul7h48Jb8rdeljKhC5Rw3cJo4nkEFITdS01Di0N_S #v7
 */

// --------------------------------------------------------------------------

// inisiasi awal
const BOT_TOKEN = "BOT_TOKEN" // <-- Bot token
const BOT_USERNAME = "BOT_USERNAME" // <-- Bot username without @
const CHANNEL_UPDATE = "TarianaChannel" // <-- Your channel update without @
const BOT_GROUP = "TarianaBicara" // <-- Your group support without @

const bot = new bapia.init(BOT_TOKEN, {
  prefix_command: "/"
});

// dont run this function
function doPost(e) {
  bot.doPost(e);
}

// ----------------------------------------------------------------------------

// inisiasi setelah deploy
const WEBHOOK_URL = "WEBHOOK_URL" // <-- your deploy url
// run one times
function setWebhook() {
  return Logger.log(bot.telegram.setWebhook(WEBHOOK_URL));
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
