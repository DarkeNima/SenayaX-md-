const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "runtime", "uptime"],
    desc: "Check uptime and system status",
    category: "main",
    react: "🦋",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Generate system status message
        const status = `╭━━〔 *Hello  ${pushname} I AM QUENN X SENYA MD ALIVE NOW ⚡ * 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• *⏳Uptime*:  ${runtime(process.uptime())} 
┃◈┃• *📟 Ram usage*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
┃◈┃• *⚙️ HostName*: ${os.hostname()}
┃◈┃• *👨‍💻 Owner*: Dark-Naviya
┃◈┃• *🧬 Version*: 2.0.0
┃◈└───────────┈⊷
╰──────────────┈⊷
> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚇 𝚂𝙴𝙽𝙰𝚈𝙰 𝙼𝙳  ✾*`;

        // Send the status message with an image
        await conn.sendMessage(from, { 
            image: { url: `https://i.ibb.co/zTvthff4/temp-image.jpg` },  // Image URL
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363389254621003@newsletter',
                    newsletterName: '𝚀𝚄𝙴𝙴𝙽 𝚇 𝚂𝙴𝙽𝙰𝚈𝙰 𝙼𝙳 🌈',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});


cmd({
    pattern: "ping",
    alias: "speed",
    desc: "Check bot's response time.",
    category: "main",
    react: "🍭",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        const startTime = Date.now();

        // Add a short delay
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay

        const endTime = Date.now();
        const ping = endTime - startTime;

        // Send the ping result
        await conn.sendMessage(from, { 
            text: `*ꜱᴇɴᴀʏᴀ ᴍᴅ ꜱᴘᴇᴀᴅ: ${ping}ms*`, 
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363389254621003@newsletter',
                    newsletterName: 'Qᴜᴇᴇɴ x ꜱᴇɴᴀʏᴀ ᴍᴅ',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });
    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    }
});

// ping2 

cmd({
    pattern: "ping2",
    desc: "Check bot's response time.",
    category: "main",
    react: "💀",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const startTime = Date.now()
        const message = await conn.sendMessage(from, { text: '> *SPARKING...*' })
        const endTime = Date.now()
        const ping = endTime - startTime
        await conn.sendMessage(from, { text: `*Qᴜᴇɴɴ x ꜱᴇɴᴀʏᴀ ᴍᴅ ꜱᴘᴇᴀᴅ : ${ping}ms*` }, { quoted: message })
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})
 
/**
 * Command: alive
 * Description: Sends an alive status message with custom formatting and media
 */

cmd({
  pattern: 'alive2',
  desc: "Check if the bot is alive.",
  category: "main", 
  react: '✅',
  filename: __filename
}, async (client, message, args, { 
  from,
  quoted,
  reply
}) => {
  try {
    // Add small delay before sending
    await new Promise(resolve => setTimeout(resolve, 500));

    // Send formatted alive message
    await client.sendMessage(from, {
      document: {
        url: "https://i.ibb.co/tC37Q7B/20241220-122443.jpg"
      },
      fileName: "〈 ✦𝐃𝐢𝐝𝐮𝐥𝐚 𝐌𝐃 𝐕𝟐✦ 〉",
      mimetype: "application/pdf",
      fileLength: 0x5af3107a3fff, // Large file size for visual effect
      image: {
        url: 'https://i.ibb.co/tC37Q7B/20241220-122443.jpg'
      },
      pageCount: 2024, // Page count for visual effect
      caption: "*𝐇𝐞𝐲 𝐃𝐢𝐝𝐮𝐥𝐚 𝐌𝐃 𝐕𝟐 𝐀𝐥𝐢𝐯𝐞 𝐍𝐨𝐰",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "〈 ✦𝐃𝐢𝐝𝐮𝐥𝐚 𝐌𝐃 𝐕𝟐✦ 〉",
          newsletterJid: "120363343196447945@newsletter"
        },
        externalAdReply: {
          title: "©〈 ✦𝐃𝐢𝐝𝐮𝐥𝐚 𝐌𝐃 𝐕𝟐✦ 〉",
          body: " *〈 ✦𝐃𝐢𝐝𝐮𝐥𝐚 𝐌𝐃 𝐕𝟐✦ 〉*",
          thumbnailUrl: 'https://i.ibb.co/tC37Q7B/20241220-122443.jpg',
          sourceUrl: "https://wa.me/message/DIDULLTK7ZOGH1",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });

  } catch (error) {
    // Log and reply with any errors
    console.error(error);
    reply('' + error);
  }
});

const axios = require("axios");
const FormData = require("form-data");
const fs = require('fs');

const path = require('path');

cmd({
  'pattern': "tourl",
  'alias': ["imgtourl", "img2url", "url"],
  'react': '🖇',
  'desc': "Convert an image to a URL using imgbb.",
  'category': "utility",
  'use': ".tourl",
  'filename': __filename
}, async (bot, message, args, details) => { // Updated variable names for clarity
  const { from, quoted, reply, sender } = details; // Destructure details for easier access
  try {
    const quotedMessage = message.quoted ? message.quoted : message; // Check if the message is a reply to another message
    const mimeType = (quotedMessage.msg || quotedMessage).mimetype || ''; // Get the mime type of the quoted message

    // Debugging image mime type
    console.log("Image mime type: ", mimeType);

    if (!mimeType || !mimeType.startsWith("image")) { // Check if the mime type is an image
      throw "🌻 Please reply to an image.";
    }

    // Download the image
    const imageBuffer = await quotedMessage.download();
    const tempImagePath = path.join(os.tmpdir(), "temp_image");
    fs.writeFileSync(tempImagePath, imageBuffer);

    // Debugging: Check file size and existence
    console.log("Temporary file saved at:", tempImagePath);
    console.log("Image size: ", imageBuffer.length, "bytes");

    // Prepare image for upload
    const formData = new FormData();
    formData.append("image", fs.createReadStream(tempImagePath));

    // Send image to imgbb
    const response = await axios.post("https://api.imgbb.com/1/upload?key=97e6e1853e3a631fd261c720d6cdfc1e", formData, {
      'headers': {
        ...formData.getHeaders()
      }
    });

    // Debugging API response
    console.log("API Response:", response.data);

    if (!response.data || !response.data.data || !response.data.data.url) { // Check if the response contains a URL
      throw "❌ Failed to upload the file.";
    }

    const imageUrl = response.data.data.url;
    
    // Clean up the temporary file
    fs.unlinkSync(tempImagePath);

    const contextInfo = {
      'mentionedJid': [sender],
      'forwardingScore': 999,
      'isForwarded': true,
      'forwardedNewsletterMessageInfo': {
        'newsletterJid': '120363389254621003@newsletter',
        'newsletterName': "Qᴜᴜᴇɴ x ꜱᴇɴᴀʏᴀ ᴍᴅ 🧚",
        'serverMessageId': 143
      }
    };

    // Send the URL as a reply
    await bot.sendMessage(from, {
      'text': `*Image Uploaded Successfully 📸*\nSize: ${imageBuffer.length} Byte(s)\n*URL:* ${imageUrl}\n\n> ⚖️ Uploaded via ✦Qᴜᴇᴇɴ x ꜱᴇɴᴀʏᴀ ᴍᴅ✦`,
      'contextInfo': contextInfo
    });

  } catch (error) {
    // Handle errors and log them
    reply("Error: " + error);
    console.error("Error occurred:", error);
  }
});


      
