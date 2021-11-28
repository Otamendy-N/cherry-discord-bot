require("colors");
require("dotenv").config()
const { Client, Intents } = require("discord.js");
const ytdl = require("ytdl-core");
const {
  AudioPlayerStatus,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} = require("@discordjs/voice");

// Create a new Instance
const bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

bot.once("ready", () => {
  console.log("[SUCCESS]".bgGreen + " Cherry launches properly!".green);
});

bot.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply(`Websocket heartbeat: ${bot.ws.ping}ms.`);
  } else if (commandName === "server") {
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
  }
});

bot.on("messageCreate", async (msg) => {
  if (msg.content == "hola") {
    const connection = joinVoiceChannel({
      channelId: msg.member.voice.channel.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild.voiceAdapterCreator,
    });

    const stream = ytdl("https://www.youtube.com/watch?v=fptYx9YBY3w", { filter: "audioonly" });
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => connection.destroy());
  }
});

bot.login(process.env.BOT_TOKEN);
