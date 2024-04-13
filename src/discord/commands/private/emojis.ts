import { Command } from "#base";
import { ApplicationCommandOptionType, ApplicationCommandType, AttachmentBuilder } from "discord.js";

new Command({
    name: "emojis",
    description: "Comando de emojis",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "servidor",
            description: "Obter todos os emojis do servidor",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "bot",
            description: "Obter todos os emojis do bot",
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    async run(interaction){
        const { options, client, guild } = interaction;
        
        const subcommand = options.getSubcommand(true);

        interface Emojis {
            static: Record<string, string>;
            animated: Record<string, string>;
        }
        const emojis: Emojis = { static: {}, animated: {} };

        switch(subcommand){
            case "bot":
            case "servidor":{
                const emojisCache = subcommand === "bot"
                ? client.emojis.cache
                : guild.emojis.cache;

                for(const { name, id, animated } of emojisCache.values()){
                    if (!name) continue;
                    emojis[animated ? "animated":"static"][name] = id;
                }

                const buffer = Buffer.from(JSON.stringify(emojis, null, 2), "utf-8");
                const attachment = new AttachmentBuilder(buffer, { description: "test", name: "emojis.json" });

                interaction.reply({
                    ephemeral, files: [attachment],
                    content: `Emojis do ${subcommand}`
                });
            } 
        }

    }
});