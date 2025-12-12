const { cmd } = require('../command');  // 'commands' ටිකක් අයින් කරලා
const axios = require("axios");

const GEMINI_API_KEY = "AIzaSyAu6vu3mGnTOue8UagnhLUdtj4LQc__9HA";  // REPLACE WITH YOUR API KEY OF GEMINI
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Auto reply to every message
cmd({
  pattern: 'all',  // All messages capture කරනවා
  react: '🤖',
  desc: "Auto reply to every message",
  category: "ai",
  filename: __filename
}, async (conn, mek, msg, { body, reply, pushname }) => {
  try {
    const text = body.trim(); // Message text එක ගන්නවා

    // Create a prompt for Gemini API
    const prompt = `මම ${pushname}, මම අසන ප්‍රශ්න වලට සිංහලෙන් පිළිතුරු දෙන්න. ඔබේ නම Gemini AI. ඔබ WhatsApp AI Bot කෙනෙක්. ඔබව හැදුවේ ayodya vichakshana කියන කෙනෙක්. සිතන්න ඔබ තරුණ කොල්ලෙක් කියල හිතල එම භාෂාවෙන් පිළිතුරු දෙන්න. Funny වෙන්න, ඔබ bot කෙනෙක් කියල හිතන්න බැරි විදිහට සැබෑ මනුස්සයෙක් කියල හිතන් පිළිතුරු දෙන්න. Use meaningful emojies, don't use English.
    [Bro = මචං, Bro = සහෝ, බං, Hi = අඩෝ, සිරාවට, එලම, Funny = ආතල්]
    මගේ ප්‍රශ්නය: ${text}`;

    // Prepare the request payload for Gemini API
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    // Call Gemini API
    const response = await axios.post(
      GEMINI_API_URL,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response is valid
    if (!response.data || !response.data.candidates || !response.data.candidates[0]?.content?.parts) {
      return reply("❌ Gemini AI පිළිතුරු ලබා ගැනීමට අසමත් විය. 😢");
    }

    // Extract the AI response
    const aiResponse = response.data.candidates[0].content.parts[0].text;
    await reply(`${aiResponse}`);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    reply("❌ ප්‍රශ්නය සැකසීමේදී දෝෂයක් ඇති විය. 😢");
  }
});
