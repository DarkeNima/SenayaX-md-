const config = require('../config');
const { cmd } = require('../command');
const { fetchJson } = require("../lib/functions");
const axios = require('axios');

// Command: movie2 - Movie search and download menu (modified to send a normal text message)
cmd({
  pattern: "mv3",
  react: '🔎',
  category: 'movie',
  desc: "Movie downloader",
  filename: __filename
}, async (client, message, context, { from, q, prefix, reply }) => {
  try {
    if (!q) {
      return await reply("*Please provide text!..*");
    }
    let searchResult = await fetchJson('https://rest-api-dark-shan.vercel.app/download/cinesubz-search?q=' + q + "&apikey=annapojira2000@");
    if (searchResult.length < 1) {
      return await client.sendMessage(from, { text: "error!" }, { quoted: context });
    }
    // Build a simple text message listing the movie results
    let resultText = "*🎥 DARK SHUTER MOVIE SEARCH 🎥*\n\n";
    searchResult.data.forEach(entry => {
      resultText += `Title: ${entry.title}\nLink: ${prefix}cinedl ${entry.link}\n\n`;
    });
    return await client.sendMessage(from, { text: resultText }, { quoted: context });
  } catch (error) {
    console.log(error);
    await client.sendMessage(from, { text: "🚩 *Error !!*" }, { quoted: context });
  }
});

// Command: cinedl - Download movie details with multiple quality options
cmd({
  pattern: "cinedl",
  react: '🎥',
  desc: "Movie downloader",
  filename: __filename
}, async (client, message, context, { from, q, prefix, reply }) => {
  try {
    if (!q) {
      return await reply("*Please provide text!..*");
    }
    // Fetch primary movie information
    let movieData1 = await fetchJson("https://rest-api-dark-shan.vercel.app/download/cinesubz-dl?q=" + q + '&apikey=annapojira2000@');
    // Fetch download options
    let movieData2 = await fetchJson("https://rest-api-dark-shan.vercel.app/download/cinesubz-dl-2?q=" + q + '&apikey=annapojira2000@');
    
    let messageText = '☘️' + movieData1.data.title +
      "\n\n📅 Release: " + movieData1.data.date +
      "\n🌎 Country: " + movieData1.data.country +
      "\n🕰 Duration: " + movieData1.data.duration +
      "\n🏆 IMDB Rating: " + movieData1.data.rating + "\n";
      
    if (movieData2.length < 1) {
      return await client.sendMessage(from, { text: "error!" }, { quoted: context });
    }
    
    // Build a text message combining details and download options.
    let downloadOptionsText = "\nDownload Options:\n";
    movieData2.data.forEach(entry => {
      downloadOptionsText += `${entry.size} - ${entry.quality}: ${prefix}cdl ${entry.alternativeLinks}&${movieData1.data.title} - ${entry.quality}\n`;
    });
    
    const finalMessage = {
      image: { url: movieData1.data.image },
      caption: messageText + downloadOptionsText + "\n" + config.FOOTER
    };
    return await client.sendMessage(from, finalMessage, { quoted: context });
  } catch (error) {
    console.log(error);
    await client.sendMessage(from, { text: "🚩 *Error !!*" }, { quoted: context });
  }
});

// Command: cdl - Download the selected movie file using a provided direct URL.
cmd({
  pattern: "cdl",
  react: '📥',
  dontAddCommandList: true,
  filename: __filename
}, async (client, message, context, { from, q, reply }) => {
  if (!q) {
    return await reply("*Please provide a direct URL!*");
  }
  try {
    // Extract URL and title from the query (separated by "&")
    const link = q.split('&')[0];
    const title = q.split('&')[1];
    // Fetch download information to retrieve the direct download link
    let downloadData = await fetchJson("https://rest-api-dark-shan.vercel.app/download/cinesubz-dl-3?q=" + link + '&apikey=annapojira2000@');
    const directLink = downloadData.data.DIRECT_LINK.trim();
    // Download the file using axios (as an arraybuffer)
    const response = await axios.get(directLink, { responseType: 'arraybuffer' });
    const fileBuffer = Buffer.from(response.data, "binary");
    const documentMessage = {
      document: fileBuffer,
      caption: "*🎞️ Name :* " + title + "\n\n*🎥 Size :* " + downloadData.data.FILE.SIZE + "\n\n*ＤＡＲＫ ＳＨＵＴＥＲ ＭＤ Ｖ2*",
      mimetype: "video/mp4",
      fileName: title + ".mp4"
    };
    await client.sendMessage(config.JID, documentMessage);
    await client.sendMessage(from, { react: { text: '✔️', key: message.key } });
  } catch (error) {
    console.error("Error fetching or sending", error);
    await client.sendMessage(from, "*Error fetching or sending *", { quoted: message });
  }
});
