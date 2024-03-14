import { Command, Component } from "#base";
import { icon } from "#functions";
import { settings } from "#settings";
import { createEmbed, createRow, sleep } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";

new Command({
    name: "exemplo",
    description: "Comando de exemplo",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        
        const embed = createEmbed({
            color: settings.colors.primary,
            description: "Clique abaixo para buscar os dados"
        });

        const row = createRow(
            new ButtonBuilder({
                customId: "data/fetch", 
                label: "Buscar",
                emoji: icon("star"),
                style: ButtonStyle.Success
            })
        );

        interaction.reply({ ephemeral, embeds: [embed], components: [row] });
    }
});

new Component({
    customId: "data/fetch",
    type: ComponentType.Button, cache: "cached",
    async run(interaction) {

        await interaction.update({
            components: [], embeds: [
                createEmbed({
                    color: settings.colors.warning,
                    description: `${icon(":a:dots")} Buscando dados! Aguarde...`
                })
            ]
        });

        await sleep(3000);

        await interaction.editReply({
            embeds: [
                createEmbed({
                    color: settings.colors.success,
                    description: `${icon("check")} Dados buscados com sucesso!`
                })
            ]
        });
    },
});