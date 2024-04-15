import { Command } from "#base";
import { db } from "#database";
import { icon, res } from "#functions";
import { menus } from "#menus";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, codeBlock } from "discord.js";

new Command({
    name: "setup",
    description: "Comando de setup",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "youtubers",
            description: "Envia o painel para aplicação de youtubers",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "canal",
                    description: "Selecione o canal",
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required,
                }
            ]
        }
    ],
    async run(interaction){
        const { options, guild } = interaction;

        await interaction.deferReply({ ephemeral });

        const guildData = await db.guilds.get(guild.id);

        switch(options.getSubcommand(true)){
            case "youtubers":{
                const channel = options.getChannel("canal", true, [ChannelType.GuildText]);

                channel.send(menus.youtubers.main(guildData))
                .then(message => {
                    interaction.editReply(res.success(`${icon("success")} Mensagem enviada com sucesso! ${message.url}`));
                })
                .catch(err => {
                    interaction.editReply(res.danger(`${icon("danger")} Ocorreu um erro ao enviar a mensagem! ${codeBlock(err)}`));
                });
                return;
            }
        }
    }
});