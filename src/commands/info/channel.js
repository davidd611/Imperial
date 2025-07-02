const discord = require("discord.js")
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
    name: "channel",
    description: "Get information about a channel",
    aliases: ["ch"],
    usage: "channel <channel>",
    data: new SlashCommandBuilder()
    .setName("channel")
    .setDescription("Get information about a channel")
    .addChannelOption(option => option.setName("canal").setDescription("The channel to get information about").setRequired(true)),
    execute: async (client, interaction) => {
        console.log("hola2");
        console.log(interaction.options._hoistedOptions)
        console.log(interaction.channel.type)
        const channel = interaction.options.getChannel("canal") || interaction.channel;
        if (!channel) {
            return interaction.reply("Please provide a valid channel")
        }
        //console.log(channel)
        const embed = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({ name: channel.name })
        .setDescription(`**Channel ID:** ${channel.id}\n**Channel Type:** ${channel.type}\n**Channel Position:** ${channel.position}\n**Channel Permissions:** ${channel.permissions}`)
        .setTimestamp()
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        interaction.reply({ embeds: [embed] })
    },  
    run: async (client, message, args) => {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
        if (!channel) {
            return message.reply("Please provide a valid channel")
        }
        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(channel.name, channel.iconURL({ dynamic: true }))
        .setDescription(`**Channel ID:** ${channel.id}\n**Channel Type:** ${channel.type}\n**Channel Position:** ${channel.position}\n**Channel Permissions:** ${channel.permissions.toArray().join(", ")}`)
        .setTimestamp()
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
        message.reply({ embeds: [embed] })
    }
}