const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 50; 
const {
    default: makeWASocket,
    getAggregateVotesInPollMessage, 
    useMultiFileAuthState,
    DisconnectReason,
    getDevice,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
    getContentType,
    Browsers,
    makeInMemoryStore,
    makeCacheableSignalKeyStore,
    downloadContentFromMessage,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    prepareWAMessageMedia,
    proto
} = require('@whiskeysockets/baileys')
const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const fs = require('fs')
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { sms,downloadMediaMessage } = require('./lib/msg')
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const axios = require('axios')
const { File } = require('megajs')
const process = require('process') 

//const autoNews = require('./ALLCMDS/autoNews')

const ownerNumber = ['94764038550']

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/session/creds.json')) {
if(!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
const sessdata = config.SESSION_ID.split("NAVIYA-MD=")[1];
const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
filer.download((err, data) => {
if(err) throw err
fs.writeFile(__dirname + '/session/creds.json', data, () => {
console.log("Session downloaded successful 💨")
})})}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

//=============================================

async function connectToWA() {
//============ connect mongodb====================
const connectDB = require('./lib/mongodb')
connectDB();
//========================================
const {readEnv} = require('./lib/database')
const config = await readEnv();
const prefix = config.PREFIX
//=======================================

console.log("Connecting...");
const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/session/')
var { version } = await fetchLatestBaileysVersion()

const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
        })
        
conn.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
connectToWA()
}
} else if (connection === 'open') {
console.log(' Installing ⚡... ')
const path = require('path');
fs.readdirSync("./plugins/").forEach((plugin) => {
if (path.extname(plugin).toLowerCase() == ".js") {
require("./plugins/" + plugin);
}
});
console.log('Plugins installed Done ✅')
console.log('Bot connected 📍')

let up = `𝚀𝚄𝙴𝙴𝙽 𝚇 𝚂𝙴𝙽𝙰𝚈𝙰 𝙼𝙳 𝙲𝙾𝙽𝙽𝙴𝙲𝚃𝙴𝙳 𝚂𝚄𝙲𝙲𝙴𝚂𝙵𝚄𝙻𝙴𝚈 𝙴𝙽𝚈𝙾𝚈 💞\n\nPREFIX: ${prefix}`;

conn.sendMessage(ownerNumber + "@s.whatsapp.net", { image: { url: `https://i.ibb.co/1Gxg3VKW/temp-image.jpg` }, caption: up })
//autoNews(conn)
//Auto-join WhatsApp channel
}    
})
conn.ev.on('creds.update', saveCreds)  


//==================================================================================
// ⭐️⭐️⭐️ MAIN MESSAGE HANDLER (FIXED FOR TYPERROR & SYNTAXERROR) ⭐️⭐️⭐️
//==================================================================================

conn.ev.on('messages.upsert', async(mek) => {
    
    // 1. Array Check & Message Extraction
    if (!mek.messages || mek.messages.length === 0) return; 
    const m = mek.messages[0];

    // 2. Status Handling (Auto Read & Auto React)
    if (m.key && m.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === "true"){
        await conn.readMessages([m.key]);
        
        // Auto React Logic
        const emojis = ['💐', '✨', '💜', '🌸', '🪴', '💞', '💫', '🍂', '🌟', '🎋', '😶‍🌫️', '🫀', '🧿', '👀', '🌈', '🚩', '🥰', '🗿', '💜', '💙', '🌝', '🖤', '💚'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: randomEmoji,
                key: m.key, 
            } 
        }, { statusJidList: [m.key.participant] });
        
        return; // Stop processing status messages
    }
    
    // 3. Content Check (Fixes TypeError: Cannot read properties of undefined)
    if (!m.message) {
        return; 
    }
    
    // 4. Command Processing Logic (Variables Definition)
    const type = getContentType(m.message); // Use 'm' instead of 'mek'
    const content = JSON.stringify(m.message);
    const from = m.key.remoteJid;
    const quoted = type == 'extendedTextMessage' && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
    const body = (type === 'conversation') ? m.message.conversation : (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : (type == 'imageMessage') && m.message.imageMessage.caption ? m.message.imageMessage.caption : (type == 'videoMessage') && m.message.videoMessage.caption ? m.message.videoMessage.caption : ''
    
    // Fetch Prefix
    const readConfig = require('./config'); 
    const prefix = readConfig.PREFIX || "!"; // Fallback prefix if not in config DB
    
    const isCmd = body.startsWith(prefix)
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
    const args = body.trim().split(/ +/).slice(1)
    const q = args.join(' ')
    const isGroup = from.endsWith('@g.us')
    const sender = m.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (m.key.participant || m.key.remoteJid)
    const senderNumber = sender.split('@')[0]
    const botNumber = conn.user.id.split(':')[0]
    const pushname = m.pushName || 'Sin Nombre'
    const isMe = botNumber.includes(senderNumber)
    const isOwner = ownerNumber.includes(senderNumber) || isMe
    const botNumber2 = await jidNormalizedUser(conn.user.id);
    const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
    const groupName = isGroup ? groupMetadata.subject : ''
    const participants = isGroup ? await groupMetadata.participants : ''
    const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false
    const isReact = m.message.reactionMessage ? true : false 
    
    const reply = (teks) => {
        conn.sendMessage(from, { text: teks }, { quoted: m }) // Use 'm' for quoted
    }
    
    conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
        let mime = '';
        let res = await axios.head(url)
        mime = res.headers['content-type']
        if (mime.split("/")[1] === "gif") {
            return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
        }
        let type = mime.split("/")[0] + "Message"
        if (mime === "application/pdf") {
            return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
        }
        if (mime.split("/")[0] === "image") {
            return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
        }
        if (mime.split("/")[0] === "video") {
            return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
        }
        if (mime.split("/")[0] === "audio") {
            return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
        }
    }


    //===================================work-type========================================= 
    if(!isOwner && config.MODE === "private") return
    if(!isOwner && isGroup && config.MODE === "inbox") return
    if(!isOwner && !isGroup && config.MODE === "groups") return
    
    //====================react============================
    if(senderNumber.includes("94764038550")){
        if(isReact) return
        m.react("🧚‍♂️") // Use 'm' for react
    }

    const events = require('./command')
    const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
    
    if (isCmd) {
        const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
        
        if (cmd) {
            if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: m.key }}) // Use 'm' key

            try {
                cmd.function(conn, m, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}); // Use 'm' for message
            } catch (e) {
                console.error("[PLUGIN ERROR] " + e);
            }
        }
    }
    
    events.commands.map(async(command) => {
        if (body && command.on === "body") {
            command.function(conn, m, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
        } else if (m.q && command.on === "text") { // Use 'm.q' (if defined somewhere else)
            command.function(conn, m, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
        } else if (
            (command.on === "image" || command.on === "photo") &&
            m.type === "imageMessage"
        ) {
            command.function(conn, m, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
        } else if (
            command.on === "sticker" &&
            m.type === "stickerMessage"
        ) {
            command.function(conn, m, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
        }
    });
    //============================================================================  
    //if (config.ALLWAYS_OFFLINE === "true") {
    // conn.sendPresenceUpdate('unavailable'); // Sets the bot's last seen sta
    //} // ⭐️ If this closing brace was missing, it caused the syntax error.
}); // ⭐️ Closing the conn.ev.on('messages.upsert') block

} // ⭐️ Closing the async function connectToWA() block

app.get("/", (req, res) => {
res.send("Queen x senya md stated !!! ");
});
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
setTimeout(() => {
connectToWA()
}, 4000);
