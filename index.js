const express = require("express");
const app = express();
app.listen(() => console.log("Server started"));
app.use('/ping', (res) => {
  res.send(new Date());
});
require("express")().listen(1343);
// الباكدجات
const Discord = require('discord.js');
const fetch = require("node-fetch");
const db = require("quick.db");
// المتغيرات
const client = new Discord.Client();
const prefix = "#";
// بداية السورس
setInterval(() => {
  var links = db.get("linkler");
  if(!links) return;
  var linkA = links.map(c => c.url)
  linkA.forEach(link => {
    try {
      fetch(link)
    } catch(e) {
      console.log("Down" + e)
     };
     console.log("UP");
  });
  
}, 60000);
// لما يشتغل بيسحب الداتا اللي هيعملها فيتش
client.on("ready", () => {
if(!Array.isArray(db.get("linkler"))) {
db.set("linkler", [])
}
});
// حالة البوت العاق
client.on("ready", () => {
setInterval(() => {
  client.user.setActivity(`${prefix}uptime |  ${db.get("linkler").length} Bot / ${client.guilds.cache.size} Servers`)
}, 7000);
});
// البوت كله علي بعضه هخه
client.on('message', message => {
  if(message.author.bot) return;
  let embed = new Discord.MessageEmbed().setColor("#ffe352");
  if(message.content === prefix + 'help') {
    embed.setTitle("Command List :reminder_ribbon:");
    embed.addField(`${prefix}uptime + Link`, [`**\`لتشغيل بوت 24 ساعه\`**`], false);
    embed.addField(`${prefix}info`, [`**\`لمعرفة معلومات عن البوت\`**`], false);
	  message.channel.send(embed);
  };
  if (message.content === prefix + "info") {
  embed.addField(`info :man_technologist:`, [`
  **Ping:** \`${client.ws.ping} MS\`\n**Servers**: \`${client.guilds.cache.size}\`\n**UpTime Bots**:\`${db.get("linkler").length}\`
  `], true);
  message.channel.send(embed);
  };
  if(message.content.startsWith(prefix + "uptime")) {
  var link = message.content.split(" ").slice(1).join(" ");

  fetch(link).then(() => {
    if(db.get("linkler").map(z => z.url).includes(link)) {
      embed.setColor("#f50909");
      embed.setTitle("DownTime :small_red_triangle_down:");
      embed.setDescription(`[**This link is already on system !! 🔴**](${link})`);
      message.channel.send(embed);
      return;
    };
    embed.setColor("#32ff80");
    embed.setTitle("Uptime :small_red_triangle:");
    embed.setDescription(`[**Done uptime and now your project online 24 hours. 🟢**](${link})`);
    message.channel.send(embed);

    db.push("linkler", { url: link, owner: message.author.username});
  }).catch(e => {
    embed.setDescription(e);
    message.channel.send(embed);
    return;
  });
  };
});
// التوكين بتاع البوت
client.login(process.env.TOKEN);
