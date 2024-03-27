import { Command } from "#base";
import { icon } from "#functions";
import { settings } from "#settings";
import { gemini } from "#tools";
import { createEmbed } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

new Command({
    name: "prompt",
    description: "Converse com a IA",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "texto",
            description: "Digite seu texto",
            type: ApplicationCommandOptionType.String,
            required,
        }
    ],
    async run(interaction){
        const { options } = interaction;
        await interaction.deferReply({ ephemeral });

        const text = options.getString("texto", true);
        
        const { response } = await gemini.text.generateContent(text);
        const result = gemini.getText(response);

        if (!result.success || !result.text){
            const embed = createEmbed({
                color: settings.colors.danger,
                description: `${icon("close")} Ocorreu um erro inesperado!`
            });

            interaction.editReply({ embeds: [embed] });
            return;
        }

        const maxLength = 3000;
        const texts: string[] = [];
        for (let i = 0; i < result.text.length; i += maxLength) {
            texts.push(result.text.slice(i, i+maxLength));
        }

        const embed = createEmbed({
            color: settings.colors.success,
            description: texts.shift()
        });
        await interaction.editReply({ embeds: [embed] });
        if (texts.length < 1) return;

        while(texts.length >= 1){
            const embed = createEmbed({
                color: settings.colors.primary,
                description: texts.shift()
            });
            await interaction.followUp({ ephemeral, embeds: [embed] });
        }
    }
});