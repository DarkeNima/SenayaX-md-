// groupCommands.js
// This file contains many group-commands for the bot including approve, requests, accept/reject join requests,
// hidetag, kick, promote, demote, mute/unmute, join group by link, delete message, leave group, group link (invite),
// group info, block (owner only), add member, and ending the group (remove all members).
// Also includes owner commands like tagadmin, boom (forward multiple messages), shutdown, broadcast, clearchats.

// Required modules and functions
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

// ---------------------------------------------------------------------------
// APPROVE COMMAND - Automatically approve specific country users in waiting list
// ---------------------------------------------------------------------------
//--------------------------------------------------------------------------
// REQUESTS COMMAND - View pending join requests
// ---------------------------------------------------------------------------
cmd({
  pattern: "requests",
  desc: "View pending join requests",
  use: ".requests",
  react: '📝',
  category: "group",
  filename: __filename
}, async (client, message, args, { from, isGroup, reply }) => {
  if (!isGroup) return await reply("This command can only be used in groups.");
  const botJid = client.user.jid;
  const groupMeta = await client.groupMetadata(from);
  // Check if bot is an admin
  const isBotAdmin = groupMeta.participants.some(p => p.jid === botJid && p.admin);
  if (!isBotAdmin) return await reply("I'm not an admin in this group.");
  try {
    const pendingRequests = await client.groupRequestParticipantsList(from);
    if (pendingRequests.length === 0) {
      return await reply("No pending join requests.");
    }
    let responseText = "Pending Join Requests:\n\n";
    pendingRequests.forEach((req, index) => {
      responseText += (index + 1) + ". @" + req.jid.split('@')[0] + "\n";
    });
    return await reply(responseText, {
      mentions: pendingRequests.map(r => r.jid)
    });
  } catch (err) {
    console.error("Error retrieving join requests:", err);
    return await reply("Failed to retrieve join requests. Please try again later.");
  }
});

// ---------------------------------------------------------------------------
// ACCEPT COMMAND - Accept group join request(s)
// ---------------------------------------------------------------------------
cmd({
  pattern: 'accept',
  desc: "Accept group join request(s)",
  use: ".accept <request numbers>",
  react: '✔️',
  category: 'group',
  filename: __filename
}, async (client, message, args, { from, isGroup, reply, match }) => {
  if (!isGroup) return await reply("This command can only be used in groups.");
  
  const botJid = client.user.jid;
  const groupMeta = await client.groupMetadata(from);
  // Check if bot is admin
  const isBotAdmin = groupMeta.participants.some(p => p.jid === botJid && p.admin);
  if (!isBotAdmin) return await reply("I'm not an admin in this group.");
  
  try {
    const pendingRequests = await client.groupRequestParticipantsList(from);
    if (pendingRequests.length === 0) return await reply("No pending join requests.");
    if (!match) return await reply("Provide the number(s) of the request(s) to accept, separated by commas.");
    
    // Convert input numbers to array indices (0-based)
    const indices = match.split(',').map(num => parseInt(num.trim()) - 1);
    const validIndices = indices.filter(idx => idx >= 0 && idx < pendingRequests.length);
    if (validIndices.length === 0) return await reply("Invalid request number(s).");
    
    // Accept each valid request
    for (let idx of validIndices) {
      await client.groupRequestParticipantsUpdate(from, [pendingRequests[idx].jid], "accept");
    }
    return await reply("Accepted " + validIndices.length + " join request(s).");
  } catch (err) {
    console.error("Error accepting join requests:", err);
    await client.sendMessage(from, {
      react: { text: '❌', key: message.key }
    });
    return await reply("Failed to accept join requests. Please try again later.");
  }
});

// ---------------------------------------------------------------------------
// REJECT COMMAND - Reject group join request(s)
// ---------------------------------------------------------------------------
cmd({
  pattern: "reject",
  desc: "Reject group join request(s)",
  use: ".reject <request numbers>",
  react: '❌',
  category: "group",
  filename: __filename
}, async (client, message, args, { from, isGroup, reply, match }) => {
  if (!isGroup) return await reply("This command can only be used in groups.");
  
  const botJid = client.user.jid;
  const groupMeta = await client.groupMetadata(from);
  // Check if bot is admin
  const isBotAdmin = groupMeta.participants.some(p => p.jid === botJid && p.admin);
  if (!isBotAdmin) return await reply("I'm not an admin in this group.");
  
  try {
    const pendingRequests = await client.groupRequestParticipantsList(from);
    if (pendingRequests.length === 0) return await reply("No pending join requests.");
    if (!match) return await reply("Provide the number(s) of the request(s) to reject, separated by commas.");
    
    const indices = match.split(',').map(num => parseInt(num.trim()) - 1);
    const validIndices = indices.filter(idx => idx >= 0 && idx < pendingRequests.length);
    if (validIndices.length === 0) return await reply("Invalid request number(s).");
    
    for (let idx of validIndices) {
      await client.groupRequestParticipantsUpdate(from, [pendingRequests[idx].jid], "reject");
    }
    return await reply("Rejected " + validIndices.length + " join request(s).");
  } catch (err) {
    console.error("Error rejecting join requests:", err);
    await client.sendMessage(from, {
      react: { text: '❌', key: message.key }
    });
    return await reply("Failed to reject join requests. Please try again later.");
  }
});

// ---------------------------------------------------------------------------
// HIDETAG COMMAND - Tag every person in the group without showing their numbers
// ---------------------------------------------------------------------------
cmd({
  pattern: "hidetag",
  react: '📢',
  alias: ["htag"],
  desc: "Tags every person of group without mentioning their numbers",
  category: "group",
  filename: __filename,
  use: "<text>"
}, async (client, message, args, { from, isGroup, sender, reply, q, participants }) => {
  // Only proceed if the bot owner or admin is using the command
  // (Assuming proper checks already, otherwise add your own)
  try {
    if (!isGroup) return reply("This command is only for groups.");
    if (!client.isBotAdmin) return reply("Bot needs to be admin.");
    // Use provided text if any 
    const textToSend = q ? q : '';
    // Mentions every participant in the group
    client.sendMessage(from, {
      text: textToSend,
      mentions: participants.map(p => p.id)
    }, { quoted: message });
  } catch (err) {
    reply("*Error !!*");
    console.error(err);
  }
});

// ---------------------------------------------------------------------------
// KICK COMMAND - Remove a participant from the group
// ---------------------------------------------------------------------------
cmd({
  pattern: 'kick',
  react: '🥏',
  alias: ['remove'],
  desc: "To Remove a participant from Group",
  category: "group",
  use: '.kick',
  filename: __filename
}, async (client, message, args, { from, isGroup, sender, reply, mentionByTag }) => {
  try {
    if (!isGroup) return reply("This is a Group only Command");
    // Check if user is admin (or the message is from self)
    if (!message.isAdmin && !message.isMe) { 
      return client.sendMessage(from, { text: "🚫 This is admin only command" }, { quoted: message });
    }
    if (!message.isBotAdmin) {
      return reply("❌ Bot must be admin first ❗");
    }
    // Get user id to kick
    const taggedUser = await mentionByTag;
    let userToKick = (await taggedUser) || message.msg.contextInfo.participant;
    if (!userToKick) return reply("🚫 Couldn't find any user in context");
    await client.groupParticipantsUpdate(from, [userToKick], "remove");
    await client.sendMessage(from, { text: "*Removed 🚫*" }, { quoted: message });
  } catch (err) {
    reply("🚫 Error occurred !!\n\n" + err);
    console.log(err);
  }
});

// ---------------------------------------------------------------------------
// PROMOTE COMMAND - Add a participant as an Admin
// ---------------------------------------------------------------------------
cmd({
  pattern: "promote",
  react: '🥏',
  alias: ["addadmin"],
  desc: "To Add a participant as an Admin",
  category: "group",
  use: ".promote",
  filename: __filename
}, async (client, message, args, { from, isGroup, sender, reply, mentionByTag, participants }) => {
  try {
    if (!isGroup) return reply("This is a Group only Command");
    if (!message.isAdmin && !message.isMe) {
      return client.sendMessage(from, { text: "🚫 This is admin only command" }, { quoted: message });
    }
    if (!message.isBotAdmin) return reply("Bot must be admin first ❗");
    
    const taggedUser = await mentionByTag;
    let userToPromote = (await taggedUser) || message.msg.contextInfo.participant;
    if (!userToPromote) return reply("🚫 Couldn't find any user in context");
    
    const currentAdmins = await getGroupAdmins(participants);
    if (currentAdmins.includes(userToPromote)) {
      return reply("*User already an admin ✅*");
    }
    await client.groupParticipantsUpdate(from, [userToPromote], 'promote');
    await client.sendMessage(from, { text: "*Promoted as an admin ✔️*" }, { quoted: message });
  } catch (err) {
    reply("🚫 Error occurred !!\n\n" + err);
    console.log(err);
  }
});

// ---------------------------------------------------------------------------
// DEMOTE COMMAND - Demote an admin back to a member
// ---------------------------------------------------------------------------
cmd({
  pattern: "demote",
  react: '🥏',
  alias: ["removeadmin"],
  desc: "To Demote Admin to Member",
  category: 'group',
  use: ".demote",
  filename: __filename
}, async (client, message, args, { from, isGroup, sender, reply, mentionByTag, participants }) => {
  try {
    if (!isGroup) return reply("This is a Group only Command");
    if (!message.isAdmin && !message.isMe) {
      return client.sendMessage(from, { text: "🚫 This is admin only command" }, { quoted: message });
    }
    if (!message.isBotAdmin) return reply("Bot must be admin first ❗");
    
    const taggedUser = await mentionByTag;
    let userToDemote = (await taggedUser) || message.msg.contextInfo.participant;
    if (!userToDemote) return reply("🚫 Couldn't find any user in context");
    
    const currentAdmins = await getGroupAdmins(participants);
    if (!currentAdmins.includes(userToDemote)) {
      return reply("*User already not an admin ✅*");
    }
    await client.groupParticipantsUpdate(from, [userToDemote], 'demote');
    await client.sendMessage(from, { text: "*User is no longer an admin ✔️*" }, { quoted: message });
  } catch (err) {
    reply("🚫 Error occurred !!\n\n" + err);
    console.log(err);
  }
});

// ---------------------------------------------------------------------------
// MUTE GROUP - Change group settings so only admins can send messages
// ---------------------------------------------------------------------------
cmd({
  pattern: 'mute',
  react: '🔒',
  alias: ["close", "mute_cyber"],
  desc: "Change to group settings to only admins can send messages.",
  category: 'group',
  use: ".mute",
  filename: __filename
}, async (client, message, args, { from, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("🚫 This is a Group command");
    if (!message.isBotAdmin) return reply("🚫 Bot must be admin first");
    if (!message.isAdmin && !message.isMe) return reply("🚫 You must be admin first");
    
    await client.groupSettingUpdate(from, "announcement");
    await client.sendMessage(from, { text: "*Group chat muted🔒*" }, { quoted: message });
  } catch (err) {
    reply("*Error !!*");
    console.log(err);
  }
});

// ---------------------------------------------------------------------------
// UNMUTE GROUP - Change group settings so all members can send messages
// ---------------------------------------------------------------------------
cmd({
  pattern: "unmute",
  react: '🔓',
  alias: ["open", "unmute_cyber"],
  desc: "Change to group settings to all members can send messages.",
  category: 'group',
  use: '.unmute',
  filename: __filename
}, async (client, message, args, { from, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("🚫 This is a Group command");
    if (!message.isBotAdmin) return reply("🚫 Bot must be admin first");
    if (!message.isAdmin && !message.isMe) return reply("🚫 You must be admin first");
    
    await client.groupSettingUpdate(from, 'not_announcement');
    await client.sendMessage(from, { text: "*Group chat unmuted 🔓*" }, { quoted: message });
  } catch (err) {
    reply("*Error !!*");
    console.log(err);
  }
});

// ---------------------------------------------------------------------------
// JOIN GROUP - Join a group by invite link
// ---------------------------------------------------------------------------
cmd({
  pattern: "join",
  desc: "Joins group by link",
  category: 'main',
  use: "<group link.>",
  filename: __filename
}, async (client, message, args, { from, reply, q }) => {
  // Only allow for proper owner/admin commands (add your own permission checks if required)
  try {
    if (!q) return reply("Please give me Query");
    const link = q.split(" ")[0];
    if (!link || !link.includes("whatsapp.com")) {
      return reply("Link Invalid, Please Send a valid WhatsApp Group Link!");
    }
    // Get invite code
    let inviteCode = link.split("https://chat.whatsapp.com/")[1];
    await client.groupAcceptInvite(inviteCode)
      .then(() => reply("*Joined group ✔️*"))
      .catch(() => reply("Error in Joining Group"));
  } catch (err) {
    reply("🚩 Not Found !");
    console.log(err);
  }
});

// ---------------------------------------------------------------------------
// DELETE MESSAGE - Delete a quoted message
// ---------------------------------------------------------------------------
cmd({
  pattern: "del",
  react: '⛔',
  alias: [','],
  desc: "Delete message",
  category: "main",
  use: ".del",
  filename: __filename
}, async (client, message, args, { from, reply }) => {
  try {
    // Build the delete object using the quoted message's id and sender info
    const deleteObj = {
      remoteJid: message.chat,
      fromMe: false,
      id: message.quoted.id,
      participant: message.quoted.sender
    };
    await client.sendMessage(message.chat, { delete: deleteObj });
  } catch (err) {
    reply("*Error !!*");
    console.error(err);
  }
});

// ---------------------------------------------------------------------------
// LEAVE GROUP - The bot leaves from the group
// ---------------------------------------------------------------------------
cmd({
  pattern: 'leave',
  react: '🔓',
  alias: ["left", "kickme"],
  desc: "To leave from the group",
  category: 'group',
  use: '.leave',
  filename: __filename
}, async (client, message, args, { from, reply, isGroup, isMe }) => {
  try {
    if (!isGroup) return reply("🚫 This is a Group command");
    if (!isMe) return reply("🚫 This is a Group command");
    await client.sendMessage(from, { text: "🔓 *Good Bye All*" }, { quoted: message });
    await client.groupLeave(from);
  } catch (err) {
    reply("*Error !!*");
    console.log(err);
  }
});

// ---------------------------------------------------------------------------
// INVITE (GROUP LINK) - Get group invite link
// ---------------------------------------------------------------------------
cmd({
  pattern: "invite",
  react: "🖇️",
  alias: ["grouplink", "glink"],
  desc: "To Get the Group Invite link",
  category: "group",
  use: ".invite",
  filename: __filename
}, async (client, message, args, { from, reply, isGroup, isBotAdmins, isAdmin }) => {
  try {
    if (!isGroup) return reply("🚫 This is a Group command");
    if (!isBotAdmins) return reply("🚫 Bot must be admin first");
    if (!isAdmin) return reply("🚫 You must be admin first");
    const inviteCode = await client.groupInviteCode(from);
    await client.sendMessage(from, { text: "🖇️ *Group Link*\n\nhttps://chat.whatsapp.com/" + inviteCode }, { quoted: message });
  } catch (err) {
    reply("*Error !!*");
    console.error(err);
  }
});

// ---------------------------------------------------------------------------
// GROUP INFO - Get group information such as subject, id, participants, creator, description, and profile pic
// ---------------------------------------------------------------------------
cmd({
  pattern: "ginfo",
  react: '🥏',
  alias: ["groupinfo"],
  desc: "Get group informations.",
  category: "group",
  use: ".ginfo",
  filename: __filename
}, async (client, message, args, { from, reply, isGroup }) => {
  try {
    if (!isGroup) return reply("⛔ *This is a Group only Command* ");
    if (!message.isBotAdmin) return reply("⛔ *Bot must be Admin First* ");
    if (!message.isAdmin && !message.isMe) return reply("🚫 *You must be a admin first*");
    
    const groupMeta = await client.groupMetadata(from);
    let profilePicUrl = await client.profilePictureUrl(from, 'image');
    const infoText = "\n*" + groupMeta.subject + "*\n\n🐉 *Group Jid* - " + groupMeta.id + "\n\n📬 *Participant Count* - " + groupMeta.size +
      "\n\n👤 *Group Creator* - " + groupMeta.owner +
      "\n\n📃 *Group Description* - " + groupMeta.desc + "\n\n";
    await client.sendMessage(from, { image: { url: profilePicUrl }, caption: infoText }, { quoted: message });
  } catch (err) {
    reply("⛔ *Error occurred !!*\n\n" + err);
    console.error(err);
  }
});

// ---------------------------------------------------------------------------
// BLOCK COMMAND - Block a user (Owner only)
// ---------------------------------------------------------------------------
cmd({
  pattern: "block",
  react: '🥏',
  alias: ["groupinfo"],
  desc: "Block a user (Owner only)",
  category: "group",
  use: ".ginfo",
  filename: __filename
}, async (client, message, args, { from, reply, isMe }) => {
  try {
    if (!isMe) return reply("⛔ *OWNER ONLY COMMAND* ");
    await client.updateBlockStatus(from, "block");
  } catch (err) {
    reply("⛔ *Error occurred !!*\n\n" + err);
    console.error(err);
  }
});

// ---------------------------------------------------------------------------
// ADD MEMBER COMMAND - Add a member to the group by phone number
// ---------------------------------------------------------------------------
cmd({
  pattern: "add",
  desc: "Add a member to the group.",
  category: "group",
  react: '➕',
  filename: __filename
}, async (client, message, args, { from, reply, isGroup, isBotAdmins, isAdmin }) => {
  try {
    if (!isGroup) return reply("*🚨 This command can only be used in GROUPs*");
    if (!isBotAdmins) return reply("*🚨 Please give me admin privileges.*");
    if (!isAdmin && !message.isMe) return reply("*🚨 Only admins can use this command*");
    
    const phoneNumber = args[0];
    if (!phoneNumber) return reply("Please provide a phone number to add.");
    await client.groupParticipantsUpdate(from, [phoneNumber + '@s.whatsapp.net'], "add");
    await reply("@" + phoneNumber + " has been added to the group.", {
      mentions: [phoneNumber + "@s.whatsapp.net"]
    });
  } catch (err) {
    console.error(err);
    reply('' + err);
  }
});

// ---------------------------------------------------------------------------
// END COMMAND - Remove all members from the group (except bot and group creator)
// ---------------------------------------------------------------------------
cmd({
  pattern: "end",
  desc: "Remove all members from the group (except bot and group creator).",
  category: "group",
  filename: __filename,
  react: '🚫'
}, async (client, message, args, { from, isGroup, isAdmins, isOwner, isBotAdmins, isMe, groupMetadata, reply }) => {
  try {
    if (!isOwner && !isMe && !isAdmins && !isBotAdmins) {
      return reply("This command can only be used by the bot owner.");
    }
    const groupCreator = groupMetadata.owner;
    const botId = client.user.id;
    // Filter participants to remove everyone except creator and bot
    const membersToRemove = groupMetadata.participants.filter(p => p.id !== groupCreator && p.id !== botId);
    await client.groupParticipantsUpdate(from, membersToRemove.map(p => p.id), "remove");
    reply("*🚫 All members have been removed from the group (except the bot and group creator).*");
  } catch (err) {
    console.error(err);
    reply("❌ Error: " + err);
  }
});

// ---------------------------------------------------------------------------
// TAGADMIN COMMAND - Tag all group admins
// ---------------------------------------------------------------------------
cmd({
  pattern: "tagadmin",
  desc: "Tags all the admins in the group.",
  category: 'group',
  use: ".tagadmin",
  filename: __filename
}, async (client, message, args, { from, isGroup, groupMetadata, groupAdmins, reply }) => {
  try {
    if (!isGroup) return reply("This command is only for groups.");
    if (groupAdmins.length === 0) return reply("There are no admins in this group.");
    
    let text = "*Tagging all admins in the group:*\n\n";
    for (let admin of groupAdmins) {
      text += '@' + admin.split('@')[0] + "\n";
    }
    await client.sendMessage(from, { text, mentions: groupAdmins }, { quoted: message });
  } catch (err) {
    console.error("Error tagging admins:", err);
    reply("An error occurred while trying to tag all admins. Please try again.");
  }
});

// ---------------------------------------------------------------------------
// BOOM COMMAND - Forward messages multiple times (owner only)
// ---------------------------------------------------------------------------
cmd({
  pattern: "boom",
  desc: "Forward messages",
  alias: ["bbb"],
  category: 'owner',
  use: ".boom <jid> & <count>",
  filename: __filename
}, async (client, message, args, { from, isGroup, sender, isOwner, reply, q }) => {
  if (!isOwner) return reply("*Owner Only ❌*");
  if (!q || !message.quoted) {
    return reply("*Give me message ❌*");
  }
  
  // Split query into target jid and count
  const targetJid = q.split(" & ")[0];
  const count = parseInt(q.split(" & ")[1]);
  let sentCount = 0;
  
  // In this example, we simply loop for 'count' times.
  while (sentCount < count) {
    sentCount++;
    // Add your forward logic here if needed
  }
  return reply("*Boom sent to:*\n\n " + targetJid);
});

// ---------------------------------------------------------------------------
// SHUTDOWN COMMAND - Shutdown the bot (owner only)
// ---------------------------------------------------------------------------
cmd({
  pattern: "shutdown",
  desc: "Shutdown the bot.",
  category: "owner",
  use: '.shutdown',
  react: '🛑',
  filename: __filename
}, async (client, message, args, { from, isOwner, reply }) => {
  if (!isOwner) return reply("❌ You are not the owner!");
  reply("🛑 Shutting down...").then(() => process.exit());
});

// ---------------------------------------------------------------------------
// BROADCAST COMMAND - Broadcast a message to all groups (owner only)
// ---------------------------------------------------------------------------
cmd({
  pattern: "broadcast",
  desc: "Broadcast a message to all groups.",
  category: "owner",
  use: ".broadcast",
  react: '📢',
  filename: __filename
}, async (client, message, args, { from, isOwner, reply }) => {
  if (!isOwner) return reply("❌ You are not the owner!");
  if (args.length === 0) return reply("📢 Please provide a message to broadcast.");
  const broadcastMsg = args.join(" ");
  // Get all groups the bot is in
  const groups = Object.keys(await client.groupFetchAllParticipating());
  for (const groupId of groups) {
    await client.sendMessage(groupId, { text: broadcastMsg }, { quoted: message });
  }
  reply("📢 Message broadcasted to all groups.");
});

// ---------------------------------------------------------------------------
// CLEARCHATS COMMAND - Clear all chats from the bot (owner only)
// ---------------------------------------------------------------------------
cmd({
  pattern: 'clearchats',
  desc: "Clear all chats from the bot.",
  category: 'owner',
  use: ".clearchats",
  react: '🧹',
  filename: __filename
}, async (client, message, args, { from, isOwner, reply }) => {
  if (!isOwner) return reply("❌ You are not the owner!");
  try {
    const allChats = client.chats.all();
    for (const chat of allChats) {
      await client.modifyChat(chat.jid, "delete");
    }
    reply("🧹 All chats cleared successfully!");
  } catch (err) {
    reply("❌ Error clearing chats: " + err.message);
  }
});
