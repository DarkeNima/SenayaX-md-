/**
 * apkDownloaderCommands.js
 *
 * This file contains commands related to APK downloading.
 * It uses the apkdl module (from "../lib/apkdl") to find and download APKs.
 * 
 * The following commands are implemented:
 *  - .apk: Search for APKs based on a query and list the found results.
 *  - .downloadapk: Download the selected APK.
 * 
 * All messages are now in plain English (no language switching).
 */

const config = require("../config");
const { cmd, commands } = require("../command");
const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson
} = require("../lib/functions");
const apkdl = require("../lib/apkdl");

// Fixed messages in English
const notFoundMessage = "*I couldn't find anything :(*";
const urlNote = "It downloads apps from playstore.";
const promptMessage = "```Please write a few words!```";

// --------------------------------------------------------------------------
// APK Command: Search for an APK and list results in a normal text message.
// --------------------------------------------------------------------------
cmd({
  pattern: "apk",
  react: '🗃️',
  alias: ["apkdl", "apkwhatsapp"],
  desc: urlNote,
  category: "download",
  use: ".apk whatsapp",
  filename: __filename
}, async (client, message, args, { from, q, reply, prefix }) => {
  try {
    if (!q)
      return await client.sendMessage(from, { text: promptMessage }, { quoted: message });
    
    // Search for APKs using the provided query.
    const searchResults = await apkdl.findapk(q);
    if (searchResults.length < 1)
      return await client.sendMessage(from, { text: notFoundMessage }, { quoted: message });
    
    // Prepare a normal message listing the found APKs.
    let resultText = "*DARK SHUTER APK DOWNLOADER*\n";
    resultText += "Select an APK by using its ID in the .downloadapk command.\n\n";
    searchResults.forEach((result, index) => {
      resultText += `${index + 1}. ${result.apk}\n   ID: ${result.id}\n`;
    });
    resultText += "\nExample: `.downloadapk <ID>`";
    
    // Send the result as a normal text message.
    return await client.sendMessage(from, { text: resultText }, { quoted: message });
  } catch (error) {
    reply('*ERROR !!*');
    console.error(error);
  }
});

// --------------------------------------------------------------------------
// DOWNLOAD APK Command: Download the selected APK based on the provided ID.
// --------------------------------------------------------------------------
cmd({
  pattern: "downloadapk",
  dontAddCommandList: true,
  filename: __filename
}, async (client, message, args, { from, q, reply, l }) => {
  try {
    // React with a download icon.
    await client.sendMessage(from, { react: { text: '📥', key: message.key } });
    
    if (!q)
      return await client.sendMessage(from, { text: "```Please write a few words!```" }, { quoted: message });
    
    // Download the APK using the provided query (ID).
    const apkData = await apkdl.download(q);
    let caption = '*📚 Name :* ' + apkData.apk + '\n*📥 Size :* ' + apkData.size;
    
    // Send an image message with APK details.
    await client.sendMessage(from, { image: { url: apkData.dllink }, caption: caption }, { quoted: message });
    
    // Send the APK file as a document.
    await client.sendMessage(from, {
      document: { url: apkData.dllink },
      mimetype: "application/vnd.android.package-archive",
      fileName: apkData.name + '.apk',
      caption: ''
    }, { quoted: message });
    
    // React to confirm download success.
    await client.sendMessage(from, { react: { text: '✔', key: message.key } });
  } catch (error) {
    reply('```ERROR !!```');
    l(error);
  }
});



const axios = require('axios');


// මේ plugin එක Eporner API භාවිතා කර search සහ download sub-commands handle කරයි.
// භාවිතය:
// !eporner search <query>
// !eporner download <video_url>

cmd({
    pattern: "eporner",
    desc: "Eporner API මගින් search සහ download කිරීමට",
    react: "🎬",
    category: "NSFW API",
    filename: __filename
}, async (client, message, args, { from, reply, q }) => {
    try {
        // අමතර argument වල අඩංගු වීම පරීක්ෂා කරන්න.
        if (!q) {
            return reply("කරුණාකර 'search' හෝ 'download' සහ query එකක් දෙන්න. උදාහරණ: !eporner search nicolette shea");
        }
        
        // command එකේ arguments space අනුව වෙන් කරගනිමු.
        const [subCommand, ...rest] = q.split(" ");
        const subArg = rest.join(" ").trim();
        
        if (subCommand.toLowerCase() === "search") {
            if (!subArg) {
                return reply("කරුණාකර search query එකක් දෙන්න. උදාහරණ: !eporner search nicolette shea");
            }
            const searchUrl = "https://nsfw-api-pinkvenom.vercel.app/api/eporner/search";
            const response = await axios.get(searchUrl, { params: { query: subArg } });
            if (response.data && response.data.results) {
                const results = response.data.results;
                let replyText = "සෙවුම් ප්‍රතිඵල:\n";
                results.forEach((item, index) => {
                    replyText += `${index + 1}. ${item.title} - ${item.videoUrl}\n`;
                });
                return reply(replyText);
            } else {
                return reply("සෙවුම් ප්‍රතිඵල හමු නොවීය.");
            }
        } else if (subCommand.toLowerCase() === "download") {
            if (!subArg) {
                return reply("කරුණාකර download URL එකක් දෙන්න. උදාහරණ: !eporner download https://www.eporner.com/video-...");
            }
            const downloadUrl = "https://nsfw-api-pinkvenom.vercel.app/api/eporner/download";
            const response = await axios.get(downloadUrl, { params: { url: subArg } });
            if (response.data && response.data.result && response.data.result.downloadUrl) {
                const downloadLink = response.data.result.downloadUrl;
                const fileInfo = response.data.result;
                const caption = `ගොනුව:\nනම: ${fileInfo.fileName}\nmime: ${fileInfo.mimetype}\nDownload: ${downloadLink}`;
                return reply(caption);
            } else {
                return reply("Download කර ගැනීමේදී දෝෂයක් ඇතිවිය.");
            }
        } else {
            return reply("එය වැරදි sub-command එකක්. කරුණාකර 'search' හෝ 'download' ලෙස sub-command එකක් භාවිතා කරන්න.");
        }
    } catch (error) {
        console.error("Eporner command error:", error);
        return reply("දෝෂයක් ඇතිවිය. කරුණාකර නැවත උත්සාහ කරන්න.");
    }
});


/*ඔන්න දාලා බලලා මට කියන්න වැඩද කියලා*/

//const { cmd, commands } = require('../command')
//const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

const yts = require("yt-search");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // Fix ekak

cmd({
    pattern: "song",
    use: '.song <query>',
    react: "🎧",
    desc: "Search and download a song",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("🔍 *Please enter a song name!*");

        const searchResults = await yts(q);
        if (!searchResults.videos.length) return reply("❌ *No results found!*");

        let video = searchResults.videos[0];

        let ytmsg = `*◈ 𝐀𝐔𝐃𝐈𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*
        
◈=======================◈
╭──────────────╮
┃ 🎵 *Title* : ${video.title}
┃
┃ ⏱️ *Duration* : ${video.timestamp}
┃
┃ 📅 *Release* : ${video.ago}
┃
┃ 📊 *Views* : ${video.views}
┃
┃ 🔗 *Link* : ${video.url}
┃
┃ ✍️ *Author* : ${video.author.name}
╰──────────────╯

*🔢 Reply to this message with a number:*
1 │❯❯◦ Audio File 🎶
2 │❯❯◦ Document File 📂

 *㋛  𝐏𝐎𝐖𝐄𝐑𝐃 𝐁𝐘  𝐍𝐀𝐕𝐈𝐘𝐀  〽️Ｄ*
`;

        // Send song details with image
        const sentMsg = await conn.sendMessage(from, { 
            image: { url: video.thumbnail }, 
            caption: ytmsg 
        }, { quoted: mek });

        // Fetch MP3 download link using API
        let apiUrl = `https://api.skyzopedia.us.kg/api/download/ytmp3?url=${encodeURIComponent(video.url)}`;
        let response = await fetch(apiUrl);
        let json = await response.json();

        if (!json.download.audio) return reply("❌ *Error:* Unable to fetch audio!");

        // Handle user response
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            // Ensure the user is replying to the bot's message
            if (
                msg.message.extendedTextMessage.contextInfo &&
                msg.message.extendedTextMessage.contextInfo.stanzaId === sentMsg.key.id
            ) {
                const selectedOption = msg.message.extendedTextMessage.text.trim();

                switch (selectedOption) {
                    case '1':
                        await conn.sendMessage(from, { 
                            audio: { url: json.download.audio }, 
                            mimetype: "audio/mpeg",
                            fileName: `${video.title}.mp3`
                        }, { quoted: msg });
                        break;

                    case '2':
                        await conn.sendMessage(from, {
                            document: { url: json.download.audio },
                            mimetype: "audio/mpeg",
                            fileName: `${video.title}.mp3`,
                            caption: "> ᴘᴏᴡᴇʀᴅ ʙʏ ɴᴀᴠɪʏᴀ ツ"
                        }, { quoted: msg });
                        break;

                    default:
                        reply("❌ Invalid option. Please select *1* or *2*.");
                }
            }
        });

    } catch (e) {
        console.log(e);
        reply('❌ An error occurred while processing your request.');
    }
});




cmd({
    pattern: "video",
    use: '.video <query>',
    react: "🎥",
    desc: "Search and download a video",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("🔍 *Please enter a video name!*");

        const searchResults = await yts(q);
        if (!searchResults.videos.length) return reply("❌ *No results found!*");

        let video = searchResults.videos[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4`;
        
        // Fetch video data from API
        const apiResponse = await axios.get(apiUrl, {
            params: { url: video.url }
        });
        const json = apiResponse.data;

        if (!json.success || !json.result.download_url) 
            return reply("❌ *Error:* Unable to fetch video!");

        // Prepare message
        let vidMsg = `*◈ 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*
        
◈=======================◈
╭──────────────╮
┃ 🎬 *Title* : ${json.result.title}
┃ 📊 *Quality* : ${json.result.quality}
┃ 🔗 *Link* : ${video.url}
┃ 📅 *Release* : ${video.ago}
┃ 📊 *Views* : ${video.views}
┃ ✍️ *Author* : ${video.author.name}
╰──────────────╯

*🎥 Downloading video...*
`;

        // Send video details with thumbnail
        await conn.sendMessage(from, { 
            image: { url: json.result.thumbnail }, 
            caption: vidMsg 
        }, { quoted: mek });

        // Download and send video
        await conn.sendMessage(from, {
            video: { url: json.result.download_url },
            mimetype: "video/mp4",
            caption: `🎬 *${json.result.title}*\n📥 *Downloaded successfully!*`,
            fileName: `${json.result.title}.mp4`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply('❌ An error occurred while processing your request.');
    }
});
