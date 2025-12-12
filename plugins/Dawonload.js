const axios = require('axios');
const { cmd } = require('../command');
const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson,
  jsonformat
} = require("../lib/functions");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetchFn }) => fetchFn(...args));



cmd({
  pattern: "gdrive",
  desc: "To download Gdrive files.",
  react: "🌐",
  category: "download",
  filename: __filename
}, async (client, message, args, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args: commandArgs,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    // React to the incoming message with a down arrow.
    await client.sendMessage(from, {
      react: {
        text: "⬇️",
        key: message.key
      }
    });
    
    // Check if a valid link is provided.
    if (!q) {
      return message.reply("Please Give Me a valid Link...");
    }
    
    // Compose the URL for the Gdrive downloader API, including the provided link and API key.
    const apiUrl = "https://api.fgmods.xyz/api/downloader/gdrive?url=" + q + "&apikey=mnp3grlZ";
    
    // Call the API using axios.
    const apiResponse = await axios.get(apiUrl);
    
    // Get the download URL from the API response.
    const downloadUrl = apiResponse.data.result.downloadUrl;
    
    // If a download URL is available, proceed to send the file.
    if (downloadUrl) {
      // React with an up arrow.
      await client.sendMessage(from, {
        react: {
          text: "⬆️",
          key: message.key
        }
      });
      
      // Send the file as a document with additional context info.
      await client.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: apiResponse.data.result.mimetype,
        fileName: apiResponse.data.result.fileName,
        caption: "*㋛ 𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚇 𝚂𝙴𝙽𝙰𝚈𝙰-𝙼Ｄ Ｍ〽️*",
        contextInfo: {
          mentionedJid: ["94764038550@s.whatsapp.net"],
          groupMentions: [],
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363389254621003@newsletter",
            newsletterName: "𝚀𝚄𝙴𝙴𝙽 𝚇 𝚂𝙴𝙽𝙰𝚈𝙰-𝙼𝙳",
            serverMessageId: 999 // 0x3e7 converted to decimal (999)
          }
        }
      }, { quoted: message });
    }
    
    // Finally, react with a checkmark to indicate success.
    await client.sendMessage(from, {
      react: {
        text: "✅",
        key: message.key
      }
    });
  } catch (error) {
    // Log any errors that occur during processing.
    console.log(error);
  }
});

cmd({
  pattern: "tiktok",
  alias: ["tt", "ttdown"],
  react: "🎥",
  desc: "Download TikTok Videos",
  category: "download",
  filename: __filename
}, async (client, message, args, { from, quoted, reply, q }) => {
  try {
    // Check if query (URL) was provided.
    if (!q) {
      return await reply("Please provide a TikTok URL.");
    }
    // Validate that the provided URL is a TikTok URL.
    if (!q.includes("tiktok.com")) {
      return await reply("This URL is invalid.");
    }

    // Define context information for the forwarded message.
    const contextInfo = {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterName: "Qᴜᴇᴇɴ ꜱᴇɴᴀʏᴀ-ᴍᴅ",
        newsletterJid: "120363389254621003@newsletter"
      }
    };

    // Fetch TikTok video data from the API.
    const response = await fetchJson("https://api.agatz.xyz/api/tiktok?url=" + q);

    // Prepare caption with video details.
    const caption = `
*㋛ 𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚇 𝚂𝙴𝙽𝙰𝚈𝙰-𝙼Ｄ Ｍ〽️*

*TIKTOK DOWNLOADER*

*📃*
*★| TITLE :* ${response.data.title}
*★| Author :* ${response.data.author.fullname}
*★| DURATION :* ${response.data.duration}
*★| VIEWS :* ${response.data.stats.views}

*🔢 Reply below number*

*[1] Tiktok Video*

1.1. 📼No-Watermark-01
1.2. 📼No-Watermark-SD
1.3. 📼No-Watermark-HD
1.4. 🎶AUDIO DOWNLOAD

*㋛ 𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚇 𝚂𝙴𝙽𝙰𝚈𝙰-𝙼Ｄ Ｍ〽️*`;

    // Send the message with video cover and caption.
    const sentMessage = await client.sendMessage(from, {
      image: {
        url: response.data.cover || ''
      },
      caption: caption,
      contextInfo: contextInfo
    }, { quoted: message });

    // Listen for reply messages.
    client.ev.on("messages.upsert", async (update) => {
      const incomingMsg = update.messages[0];
      if (!incomingMsg.message || !incomingMsg.message.extendedTextMessage) {
        return;
      }
      const option = incomingMsg.message.extendedTextMessage.text.trim();

      // Ensure the incoming message is a reply to the bot's message.
      if (
        incomingMsg.message.extendedTextMessage.contextInfo &&
        incomingMsg.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id
      ) {
        switch (option) {
          case "1.1":
            await client.sendMessage(from, {
              video: {
                url: response.data.data[0].url
              },
              mimetype: "video/mp4",
              caption: "*㋛ 𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚇 𝚂𝙴𝙽𝙰𝚈𝙰-𝙼Ｄ Ｍ〽️*",
              contextInfo: contextInfo
            }, { quoted: incomingMsg });
            break;
          case "1.2":
            await client.sendMessage(from, {
              video: {
                url: response.data.data[1].url
              },
              mimetype: "video/mp4",
              caption: "*㋛ 𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚇 𝚂𝙴𝙽𝙰𝚈𝙰-𝙼Ｄ Ｍ〽️*",
              contextInfo: contextInfo
            }, { quoted: incomingMsg });
            break;
          case "1.3":
            await client.sendMessage(from, {
              video: {
                url: response.data.data[2].url
              },
              mimetype: "video/mp4",
              caption: "*㋛ 𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚇 𝚂𝙴𝙽𝙰𝚈𝙰-𝙼Ｄ Ｍ〽️*",
              contextInfo: contextInfo
            }, { quoted: incomingMsg });
            break;
          case "1.4":
            await client.sendMessage(from, {
              audio: {
                url: response.data.music_info.url
              },
              mimetype: "audio/mpeg",
              contextInfo: contextInfo
            }, { quoted: incomingMsg });
            break;
          default:
            await client.sendMessage(from, {
              text: "❌ Invalid option. Please select a valid number."
            }, { quoted: incomingMsg });
            break;
        }
      }
    });
  } catch (error) {
    console.error(error);
    await reply("❌ *I couldn't find anything. Please try again later...*");
    await client.sendMessage(botNumber + "@s.whatsapp.net", {
      text: "❗ *Error Info:* " + error
    }, { quoted: message });
  }
});

cmd({
  pattern: "fb",
  alias: ["fbdl", "facebook"],
  react: "🎥",
  desc: "Download Facebook Video.",
  category: "download",
  filename: __filename
}, async (client, message, args, { from, q, reply }) => {
  try {
    // Check if URL was provided.
    if (!q) {
      return await reply("*❗Please provide a Facebook video URL*");
    }

    // Define context information.
    const contextInfo = {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterName: "Qᴜᴇᴇɴ ꜱᴇɴᴀʏᴀ-ᴍᴅ",
        newsletterJid: "120363389254621003@newsletter"
      }
    };

    // Fetch Facebook video data from the API.
    const response = await fetchJson("https://api.agatz.xyz/api/facebook?url=" + q);

    // Prepare caption with video details.
    const caption = `
*㋛ 𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚇 𝚂𝙴𝙽𝙰𝚈𝙰-𝙼Ｄ Ｍ〽️*

+ *★| Title :* ${response.data.title}
+ *★| Url :* ${response.data.url}

*🔢 Reply with the number below*

*[1] Facebook Video*

1.1  🪫 SD QUALITY Video
1.2 🔋 HD QUALITY Video

*㋛ 𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚇 𝚂𝙴𝙽𝙰𝚈𝙰-𝙼Ｄ Ｍ〽️*`;

    // Send message with video thumbnail and caption.
    const sentMessage = await client.sendMessage(from, {
      image: {
        url: response.data.thumbnail || ''
      },
      caption: caption,
      contextInfo: contextInfo
    }, { quoted: message });

    // Listen for reply messages.
    client.ev.on("messages.upsert", async (update) => {
      const incomingMsg = update.messages[0];
      if (!incomingMsg.message || !incomingMsg.message.extendedTextMessage) return;
      const option = incomingMsg.message.extendedTextMessage.text.trim();

      // Check if the incoming message is a reply to the previously sent message.
      if (incomingMsg.message.extendedTextMessage.contextInfo?.stanzaId === sentMessage.key.id) {
        switch (option) {
          case "1.1":
            await client.sendMessage(from, {
              video: {
                url: response.data.sd
              },
              mimetype: "video/mp4",
              caption: "*㋛ 𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚇 𝚂𝙴𝙽𝙰𝚈𝙰-𝙼Ｄ Ｍ〽️*",
              contextInfo: contextInfo
            }, { quoted: incomingMsg });
            break;
          case "1.2":
            await client.sendMessage(from, {
              video: {
                url: response.data.hd
              },
              mimetype: "video/mp4",
              caption: "*㋛ 𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚇 𝚂𝙴𝙽𝙰𝚈𝙰-𝙼Ｄ Ｍ〽️*",
              contextInfo: contextInfo
            }, { quoted: incomingMsg });
            break;
          default:
            await client.sendMessage(from, {
              text: "❌ Invalid option. Please select a valid number."
            }, { quoted: incomingMsg });
            break;
        }
      }
    });
  } catch (error) {
    console.log(error);
    await reply("❌ *I couldn't find anything. Please try again later...*");
    await client.sendMessage(botNumber + "@s.whatsapp.net", {
      text: "❗ *Error Info:* " + error
    }, { quoted: message });
  }
});

const { ytmp4 } = require("@vreden/youtube_scraper");
const yts = require("yt-search");

cmd({
    pattern: "video3",
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

        let ytmsg = `*◈ 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*
        
◈=======================◈
╭──────────────╮
┃ 🎥 *Title* : ${video.title}
┃
┃ 📊 *Views* : ${video.views}
┃
┃ 🔗 *Link* : ${video.url}
╰──────────────╯

*🔢 Reply to this message with a number:*
1 │❯❯◦ 360p 🎥
2 │❯❯◦ 480p 🎥
3 │❯❯◦ 720p 🎥
4 │❯❯◦ 1080p 🎥
5 │❯❯◦ 1440p 🎥

 *㋛  𝐏𝐎𝐖𝐄𝐑𝐃 𝐁𝐘  𝐍𝐀𝐕𝐈𝐘𝐀  〽️Ｄ*
`;

        const sentMsg = await conn.sendMessage(from, { 
            image: { url: video.thumbnail }, 
            caption: ytmsg 
        }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            if (
                msg.message.extendedTextMessage.contextInfo &&
                msg.message.extendedTextMessage.contextInfo.stanzaId === sentMsg.key.id
            ) {
                const selectedOption = msg.message.extendedTextMessage.text.trim();
                let quality;

                // Quality selection
                switch (selectedOption) {
                    case '1':
                        quality = "360";
                        break;
                    case '2':
                        quality = "480";
                        break;
                    case '3':
                        quality = "720";
                        break;
                    case '4':
                        quality = "1080";
                        break;
                    case '5':
                        quality = "1440";
                        break;
                    default:
                        return await conn.sendMessage(from, { 
                            text: "❌ Invalid option. Please select a valid quality number." 
                        }, { quoted: msg });
                }

                // Fetch video download link
                const videoData = await ytmp4(video.url, quality);
                if (!videoData.download.url) return reply("❌ *Error:* Unable to fetch video!");

                await conn.sendMessage(from, { 
                    video: { url: videoData.download.url }, 
                    caption: `${video.title} (${quality}p)`,
                    mimetype: "video/mp4"
                }, { quoted: msg });
            }
        });

    } catch (e) {
        console.log(e);
        reply('❌ An error occurred while processing your request.');
    }
});

