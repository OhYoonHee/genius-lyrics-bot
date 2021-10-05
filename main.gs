// cc: Oh_Yoon_Hee

const genius = new Genius();
const start_regex = new RegExp("/" + "start" + `(?:@${BOT_USERNAME})?` + "(?:[\\s\\n]|$)?([\\s\\S]+)?$", "i");

function startHandler(ctx) {
  if (Boolean(ctx.payload) == false || ctx.payload.trim() == "start") {
    /*ctx.replyWithSticker('CAACAgIAAxkBAAIBD2FanZDIXEXq6Z2ULK-0uL2Z8N-5AAI_FAACwB0YSB5bNn8gQBvmIQQ', {
      reply_to_message_id: ctx.message.message_id,
      allow_sending_without_reply: true
    });*/
    let pesan = "Hai! perkenalkan nama saya <b>Genius Lyrics Bot</b>\nSaya dibuat untuk mempermudah anda mencari lirik di <a href=\"https://genius.com\">Genius Lyrics</a>";
    pesan += "\n\nSilakan kirim judul lagu yang anda ingin cari ke saya, saya juga berfungsi pada mode inline";
    pesan += "\n\nJika anda menemukan bugs silakan laporkan ke group saya";
    pesan += "\n\nDibuat menggunakan <a href=\"https://lumpia.js.org/\">GAS lib v3</a>"
    let reply_markup = new InlineKeyboard();
    reply_markup.url("👥 Group saya 👥", `https://t.me/${BOT_GROUP}`).url("🔰 Update channel 🔰", `https://t.me/${CHANNEL_UPDATE}`).row()
    reply_markup.switchInlineCurrent("🔎 Mencari di mode inline 🔍", "");
    ctx.reply(pesan, { parse_mode: "HTML", reply_markup })
    return;
  }

  const id = ctx.payload;
  let hasil = genius.getInfobyId(id.trim());

  if (hasil == false) {
    /*ctx.replyWithSticker('CAACAgIAAxkBAAIBD2FanZDIXEXq6Z2ULK-0uL2Z8N-5AAI_FAACwB0YSB5bNn8gQBvmIQQ', {
      reply_to_message_id: ctx.message.message_id,
      allow_sending_without_reply: true
    });*/
    let pesan = "Hai! perkenalkan nama saya <b>Genius Lyrics Bot</b>\nSaya dibuat untuk mempermudah anda mencari lirik di <a href=\"https://genius.com\">Genius Lyrics</a>";
    pesan += "\n\nSilakan kirim judul lagu yang anda ingin cari ke saya, saya juga berfungsi pada mode inline";
    pesan += "\n\nJika anda menemukan bugs silakan laporkan ke group saya";
    pesan += "\n\nDibuat menggunakan <a href=\"https://lumpia.js.org/\">GAS lib v3</a>"
    let reply_markup = new InlineKeyboard();
    reply_markup.url("👥 Group saya 👥", `https://t.me/${BOT_GROUP}`).url("🔰 Update channel 🔰", `https://t.me/${CHANNEL_UPDATE}`).row()
    reply_markup.switchInlineCurrent("🔎 Mencari di mode inline 🔍", "");
    ctx.reply(pesan, { parse_mode: "HTML", reply_markup })
    return;
  };

  let { image, url, artist_title } = hasil;
  let reply_markup = new InlineKeyboard();
  reply_markup.url("🎼 Genius 🎼", url);
  if (hasil.youtube_url) {
    reply_markup.url("🎬 Youtube 🎬", hasil.youtube_url);
  }
  let caption = artist_title;
  ctx.replyWithPhoto(image, { caption, reply_markup, reply_to_message_id: ctx.message.message_id, allow_sending_without_reply: true });
  let lyrics = genius.bypass_web(url);
  if (lyrics == false) return;
  lyrics += `\n\nFetched using @${BOT_USERNAME}\nJoin @${CHANNEL_UPDATE} for updates`;
  return ctx.reply(lyrics, { reply_to_message_id: ctx.message.message_id, allow_sending_without_reply: true });
};

bot.start(startHandler)

bot.on("text", function (ctx) {

  if (start_regex.test(ctx.message.text)) {
    return;
  }

  if (/^\/debug$/.exec(ctx.message.text)) {
    return ctx.reply(JSON.stringify(ctx.message, null, 2))
  }
  
  try {
    const search_song = genius.search(ctx.message.text);
    if (search_song == false) {
      return ctx.reply("Tidak ada lagu ditemukan");
    };
    let keyB = new InlineKeyboard();
    for (let song of search_song) {
      keyB.text(song.artist_title, `song ${song.id}`).row();
    };
    let reply_markup = {
      inline_keyboard: keyB.inline_keyboard
    };
    return ctx.reply("Beberapa hasil yang ditemukan dari pencarianmu:", {
      reply_markup, reply_to_message_id: ctx.message.message_id, allow_sending_without_reply: true
    });
  } catch (e) {
    let reply_markup = new InlineKeyboard();
    reply_markup.url("Group Chat", "https://t.me/TarianaBicara");
    return ctx.reply("Telah terjadi error, silakan laporkan ke group saya", { reply_markup, reply_to_message_id: ctx.message.message_id, allow_sending_without_reply: true });
  }
});

bot.on('callback_query', function (ctx) {
  let cb = ctx.update.callback_query;
  let [_, id] = cb.data.split(" ");
  if (_ != "song") return;
  ctx.deleteMessage(cb.message.message_id);
  let hasil = genius.getInfobyId(id);
  if (hasil == false) return;
  let { image, url, artist_title } = hasil;
  let reply_markup = new InlineKeyboard();
  reply_markup.url("🎼 Genius 🎼", url);
  if (hasil.youtube_url) {
    reply_markup.url("🎬 Youtube 🎬", hasil.youtube_url);
  }
  let caption = artist_title;
  ctx.replyWithPhoto(image, { caption, reply_markup, allow_sending_without_reply: true });
  let lyrics = genius.bypass_web(url);
  if (lyrics == false) return;
  lyrics += `\nFetched using @${BOT_USERNAME}\nJoin @${CHANNEL_UPDATE} for updates`;
  return ctx.reply(lyrics);
});

bot.on('inline_query', function (ctx) {
  const iq = ctx.update.inline_query;
  if (iq.query.length < 1) {
    ctx.answerInlineQuery([], {
      switch_pm_text: "Cari lagu diprivate chat",
      switch_pm_parameter: "start"
    });
    return;
  }
  const search_result = genius.search(iq.query);
  if (search_result == false) {
    ctx.answerInlineQuery([], {
      switch_pm_text: "Cari lagu diprivate chat",
      switch_pm_parameter: "start"
    });
    return;
  }
  const results = search_result.map(element => ({
    type: "article",
    id: element.id,
    thumb_url: element.image,
    title: element.title,
    description: element.full_title,
    input_message_content: {
      message_text: `Title : ${element.full_title}\nArtist: ${element.artist.name}\nArtist url: ${element.artist.url}`,
      disable_web_page_preview: true
    },
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🎼 Genius 🎼",
            url: element.url
          },
          {
            text: "📝 Get lyrics 📝",
            url: `https://t.me/${BOT_USERNAME}?start=${element.id}`
          }
        ]
      ]
    }
  }));
  return ctx.answerInlineQuery(results, { is_personal: true });
});
