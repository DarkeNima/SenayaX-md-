const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

// This plugin integrates the Cinesubz free APIs.
// API Details:
// - Search API: https://darksadas-yt-cinezsub-search.vercel.app/?query=<QUERY>&apikey=pramashi01
// - Movie Info API: https://darksadas-yt-cineszub-info.vercel.app/?url=<MOVIE_URL>&apikey=pramashi01
// - Download Link API: https://darksadas-yt-cinezsub-dl.vercel.app/?url=<MOVIE_URL>&apikey=pramashi01
//
// Command Pattern: "cinesub" (alias: "cs")
//
// Flow:
// 1. The user provides a search query.
// 2. The plugin calls the Search API to retrieve matching movies.
// 3. It displays the top 10 results.
// 4. The user replies with a number corresponding to the desired movie.
// 5. The plugin fetches movie details via the Movie Info API.
// 6. It then retrieves download links via the Download Link API.
// 7. The plugin sends movie info with available quality options.
// 8. On the user’s selection, it sends the movie file as a document.
cmd({
  pattern: "cinesub",
  alias: ["cs"],
  react: "🎬",
  category: "download",
  desc: "චිත්‍රපට සෙවීමට හා Cinesubz free API භාවිතයෙන් download link ලබා ගැනීමට",
  filename: __filename
}, async (conn, message, msg, { from, q, reply }) => {
  if (!q) {
    return await reply("කරුණාකර චිත්‍රපටයක් සෙවීමට query එකක් ලබා දෙන්න!");
  }

  try {
    // Step 1: Search for movies using the Cinesubz Search API.
    const searchApiUrl = `https://darksadas-yt-cinezsub-search.vercel.app/?query=${encodeURIComponent(q)}&apikey=pramashi01`;
    const searchData = await fetchJson(searchApiUrl);

    // Debug: Log API response to console for inspection.
    console.debug("Cinesub Search API Response:", searchData);

    // Notice: API response property is "data" instead of "results".
    
    const topResults = searchData.data.slice(0, 10);
    let resultMessage = `🎬 *"${q}" සඳහා සෙවුම් ප්‍රතිඵල*:\n\n`;
    topResults.forEach((movie, index) => {
      resultMessage += `*${index + 1}.* ${movie.title}\n🔗 Link: ${movie.link}\n\n`;
    });
    resultMessage += "කරුණාකර ඔබ කැමති චිත්‍රපටය තෝරන්න (සංඛ්‍යාව reply කරන්න).";

    // Send the search results.
    const sentMsg = await conn.sendMessage(from, { text: resultMessage }, { quoted: message });
    const searchMessageId = sentMsg.key.id;

    // Listen for the user's reply for movie selection.
    conn.ev.on('messages.upsert', async (msgUpdate) => {
      const newMsg = msgUpdate.messages[0];
      if (!newMsg.message) return;

      const userResponse = newMsg.message.conversation || newMsg.message.extendedTextMessage?.text;
      const isReply = newMsg.message.extendedTextMessage &&
                      newMsg.message.extendedTextMessage.contextInfo.stanzaId === searchMessageId;

      if (isReply) {
        const selectedNumber = parseInt(userResponse.trim());
        if (isNaN(selectedNumber) || selectedNumber < 1 || selectedNumber > topResults.length) {
          return await reply("කරුණාකර වලංගු (valid) සංඛ්‍යාවක් reply කරන්න.");
        }

        const selectedMovie = topResults[selectedNumber - 1];

        // Step 2: Fetch movie details using the Movie Info API.
        const infoApiUrl = `https://darksadas-yt-cineszub-info.vercel.app/?url=${encodeURIComponent(selectedMovie.link)}&apikey=pramashi01`;
        const infoData = await fetchJson(infoApiUrl);
        if (!infoData || !infoData.result) {
          return await reply("චිත්‍රපටයේ තොරතුරු ලබාගන්න බැරි වුණා. කරුණාකර නැවත උත්සාහ කරන්න.");
        }
        const details = infoData.result;

        // Step 3: Fetch download links using the Download Link API.
        const dlApiUrl = `https://darksadas-yt-cinezsub-dl.vercel.app/?url=${encodeURIComponent(selectedMovie.link)}&apikey=pramashi01`;
        const dlData = await fetchJson(dlApiUrl);
        if (!dlData || !Array.isArray(dlData.download_links) || dlData.download_links.length === 0) {
          return await reply("මෙම චිත්‍රපටය සඳහා download links හමු නොවුණා.");
        }
        const downloadLinks = dlData.download_links;

        // Prepare a message with movie details and available quality options.
        let infoMessage = `🎥 *${details.title}*\n\n`;
        infoMessage += `📆 නිකුත් දිනය: ${details.date || 'N/A'}\n`;
        infoMessage += `⏱️ කාලය: ${details.duration || 'N/A'}\n\n`;
        infoMessage += `*පවතින ගුණාත්මකතා (quality) විකල්ප:*\n`;
        downloadLinks.forEach((link, idx) => {
          infoMessage += `*${idx + 1}.* ${link.quality} - ${link.size}\n`;
        });
        infoMessage += "\nකරුණාකර ඔබ කැමති ගුණාත්මකතාව reply කරන්න.";

        const infoSent = await conn.sendMessage(from, { text: infoMessage }, { quoted: newMsg });
        const infoMessageId = infoSent.key.id;

        // Listen for user's quality selection.
        conn.ev.on('messages.upsert', async (qualityUpdate) => {
          const qualityMsg = qualityUpdate.messages[0];
          if (!qualityMsg.message) return;
          const qualityResponse = qualityMsg.message.conversation || qualityMsg.message.extendedTextMessage?.text;
          const isReplyToInfo = qualityMsg.message.extendedTextMessage &&
                                qualityMsg.message.extendedTextMessage.contextInfo.stanzaId === infoMessageId;

          if (isReplyToInfo) {
            const qualityNumber = parseInt(qualityResponse.trim());
            if (isNaN(qualityNumber) || qualityNumber < 1 || qualityNumber > downloadLinks.length) {
              return await reply("කරුණාකර වලංගු (valid) සංඛ්‍යාවක් reply කරන්න.");
            }

            const selectedDownload = downloadLinks[qualityNumber - 1];

            // React to indicate the download is starting.
            await conn.sendMessage(from, { react: { text: '⬇️', key: message.key } });

            // Send the movie file as a document.
            await conn.sendMessage(from, {
              document: { url: selectedDownload.link },
              mimetype: "video/mp4",
              fileName: `${details.title}.mp4`,
              caption: details.title
            }, { quoted: qualityMsg });

            await conn.sendMessage(from, { react: { text: '✅', key: message.key } });
          }
        });
      }
    });
  } catch (error) {
    console.error("Error in cinesub command:", error);
    await reply("ඇපි කැඳවීමේදී දෝෂයකි. කරුණාකර නැවත උත්සාහ කරන්න.");
  }
});
