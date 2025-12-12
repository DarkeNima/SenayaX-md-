const { cmd } = require('../command');
const { getBuffer } = require('../lib/functions'); 
const axios = require('axios');
const API = 'https://api.lolhuman.xyz/api/tiktok'; // ⭐️ විශ්වාසනීය API එකක් (lolhuman) පාවිච්චි කරමු.

cmd({
    pattern: "tiktok2",
    alias: ['tt2'],
    react: '🎵',
    category: "download",
    desc: "Downloads TikTok videos (No Watermark).",
    filename: __filename
}, async (conn, message, msg, { from, q, reply }) => {
    try {
        if (!q) {
            // Check if the input is a URL
            return await reply("*Please provide a valid TikTok video link!*\n\nExample: `!tiktok https://vt.tiktok.com/ZSNCf....`");
        }
        
        // 1. URL Validation (Simple check if the input contains common TikTok domains)
        const isTikTokUrl = q.includes('tiktok.com');
        if (!isTikTokUrl) {
             return await reply("🛑 The provided text does not look like a TikTok URL.");
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: message.key } });

        // 2. Call the TikTok API (You can replace 'API_KEY' with your actual API key if required by the service)
        // Note: For simplicity and stability, we are using a publicly available API (lolhuman) that might not need a key, 
        // or you can configure a key if you have one.
        const apiUrl = `${API}?apikey=API_KEY&url=${encodeURIComponent(q)}`; // Replace API_KEY if needed.

        // If you were to use 'api-dylux' (your dependency), the code would be different, but lolhuman is very reliable.
        
        const response = await axios.get(apiUrl);
        const data = response.response;

        if (!data || !data.video_no_watermark) {
            return await reply("❌ Video download failed. The link might be invalid or the video is private.");
        }

        const videoUrl = data.video_no_watermark;
        const info = data.title || "No Title";
        const author = data.author.username || "Unknown Author";
        
        // 3. Send the Video
        await conn.sendMessage(from, { react: { text: '⬇️', key: message.key } });

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `✅ *TikTok Download Success!*\n\n📌 *Title:* ${info}\n👤 *Author:* @${author}\n\n_No Watermark Downloaded by Queen Senaya MD_`,
            mimetype: 'video/mp4'
        }, { quoted: message });

        await conn.sendMessage(from, { react: { text: '✅', key: message.key } });

    } catch (error) {
        console.error("TikTok download error:", error);
        // Check for specific API errors (e.g., rate limit, invalid key)
        if (error.response?.status === 404) {
             return reply("⚠️ API Failed! The TikTok link is probably invalid or the API key is missing.");
        }
        reply("❌ An unexpected error occurred during TikTok download.");
    }
});
