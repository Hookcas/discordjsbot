const { Client, MessageEmbed } = require("discord.js");
const { TOKEN, PREFIX } = require("./config");
const client = new Client({disableEveryone: true });

client.on("message", msg => {
  if (msg.author.bot) return;
  if (msg.content.indexOf(PREFIX) !== 0) return
  const args = msg.content.slice(PREFIX.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd === "ping") msg.channel.send("Pong!");
  if (cmd === "repeat") {
    msg.channel.send(args.join(" "));
    msg.delete({ timeout: 3000 }).then(msg => console.log("Un message a été supprimé"));
  }
  if (cmd === "role") {
    const channel = client.channels.find(r => r.name === "logs");
    const role = msg.guild.roles.find(r => r.name === args[0]);
    if (!role) return msg.channel.send("Ce rôle n'existe pas !");
    if (msg.member.roles.find(r => r.name === args[0])) {
      msg.member.roles.remove(role);
      channel.send(`J'ai supprimé le rôle ${role} à ${msg.author}.`);
      msg.delete({ timeout: 3000 });
    } else {
      msg.member.roles.add(role);
      channel.send(`J'ai ajouté le rôle ${role} à ${msg.author}.`);
      msg.delete({ timeout: 3000 });
    }
  }
  if (cmd === "sinfo") {
    const embed = new MessageEmbed()
      .setDescription(msg.guild.name)
      .setThumbnail(msg.guild.iconURL())
      .addField("Membres", msg.guild.memberCount, true)
      .addField("Owner", msg.guild.owner.user.tag, true)
      .setImage(msg.guild.owner.user.avatarURL())
      .setTimestamp();
    msg.channel.send(embed);
  }
});

client.on("guildMemberAdd", member => {
  member.send("Salut à toi !");
  const channel = client.channels.find(r => r.name === "général");
  channel.send(`${member} à rejoint la planete Centurion !`);
});

client.login(TOKEN);

client.on("ready", () => console.log("Je suis prêt !"));
client.on("error", console.error);
client.on("warn", console.warn);
client.on("debug", console.log);