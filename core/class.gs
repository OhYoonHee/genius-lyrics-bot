// cc: grammY source
class InlineKeyboard {

  constructor() {
    this.inline_keyboard = [[]];
  }

  add(...buttons) {
    this.inline_keyboard[this.inline_keyboard.length - 1].push(...buttons);
    return this;
  }

  row(...buttons) {
    this.inline_keyboard.push(buttons);
    return this;
  }

  url(text, url) {
    return this.add({ text, url });
  }

  text(text, data = text) {
    return this.add({ text, callback_data: data });
  }

  switchInline(text, query = '') {
    return this.add({ text, switch_inline_query: query });
  }

  switchInlineCurrent(text, query = '') {
    return this.add({ text, switch_inline_query_current_chat: query });
  }

  game(text) {
    return this.add({ text, callback_game: {} });
  }

  pay(text) {
    return this.add({ text, pay: true });
  }
};

// cc: Oh_Yoon_Hee
class Genius {

  constructor() { }

  search(q) {
    try {
      const init = new bapia.fetch("https://genius.com/api");
      const json = init.get('/search/songs', { q, per_page: 15 });
      const { meta, response } = json;
      if (meta.status != 200) return false;
      const section = response.sections.shift();
      if (section == undefined) return false;
      if (section.hits.length < 1) return false;
      const hasil = section.hits.map(function (element) {
        const { result } = element;
        const { url, title, id, song_art_image_url, primary_artist, instrumental, api_path, full_title } = result;
        const artist = {
          name: primary_artist.name,
          url: primary_artist.url,
          image: primary_artist.image_url
        };
        let apiPath = "https://genius.com/api" + api_path;
        const artist_title = `${artist.name} - ${title}`;
        const alhasil = { artist, artist_title, apiPath, full_title, url, title, id, instrumental, image: song_art_image_url };
        return alhasil;
      }).filter((element) => !element.instrumental);
      return hasil;
    } catch (e) {
      return false;
    }
  }

  getInfobyId(idSong) {
    try {
      const init = new bapia.fetch(this.apiurl_by_id(idSong));
      const json = init.get("/");
      const { meta, response } = json;
      if (meta.status != 200) return false;
      const { share_url, title, id, song_art_image_url, primary_artist, instrumental, full_title } = response.song;
      const artist = {
        name: primary_artist.name,
        url: primary_artist.url,
        image: primary_artist.image_url
      };
      const youtube_url = response.song.youtube_url;
      const artist_title = `${artist.name} - ${title}`;
      const hasil = { artist, artist_title, full_title, title, id, instrumental, youtube_url, url: share_url, image: song_art_image_url };
      return hasil;
    } catch (e) {
      return false;
    }
  }

  apiurl_by_id(id) {
    return "https://genius.com/api/songs/" + id;
  }

  bypass_web(url) {
    try {
      const acak_big_num = bapia.helper.random(190, 2000);
      const get_api = UrlFetchApp.fetch(url, {
        headers: {
          Cookie: `_genius_ab_test_cohort=${acak_big_num};`
        }
      });
      const getText = get_api.getContentText();
      const $ = Cheerio.load(getText);
      const lyrics = $('.lyrics').text().trim();
      if (lyrics.length < 1) return false;
      return lyrics;
    } catch (e) {
      return false;
    }
  }
}