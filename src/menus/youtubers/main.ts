import { GuildSchema } from "#database";
import { formatedChannelMention, formatedRoleMention, icon } from "#functions";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export function youtubersMainMenu(guildData: GuildSchema){
    const { channels, roles } = guildData;

    const embed = createEmbed({
        color: "#ef3f3f",
        description: brBuilder(
            `# ${icon("s-youtube")} Aplicação para Youtuber`,
            "",
            "📜 Requisitos mínimos:",
            "- Ter 500 inscritos",
            "- Conteúdo family friend",
            "- Conteúdo relacionado a programação",
            "- Pelo menos 3 vídeos nos últimos 3 meses",
            "",
            "Você receberá:",
            `- Cargo: ${formatedRoleMention(roles?.youtuber?.id)}`,
            `- Permissão para divulgar em ${formatedChannelMention(channels?.promotion?.id)}`
        )
    });
    
    const row = createRow(
        new ButtonBuilder({
            customId: "form/youtubers/open/none",
            label: "Aplicar para youtuber",
            style: ButtonStyle.Danger,
            emoji: icon("s-youtube")
        })
    );

    return { embeds: [embed], components: [row] };
}