import { icon } from "#functions";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, GuildMember } from "discord.js";

interface FormData {
    name: string;
    channel: string;
}
export function youtubersManageMenu(member: GuildMember, data: FormData){
    const embed = createEmbed({
        thumbnail: member.displayAvatarURL(),
        color: "#ef3f3f",
        description: brBuilder(
            `## ${icon("s-youtube")} Formulário para tag youtuber`,
            `Membro: ${member}`
        ),
        fields: [
            { name: "Nome", value: data.name },
            { name: "Canal", value: data.channel },
        ]
    });

    const row = createRow(
        new ButtonBuilder({
            customId: `manage/application/youtuber/${member.id}/accept`, 
            label: "Aceitar",
            emoji: icon("check"), 
            style: ButtonStyle.Success
        }),
        new ButtonBuilder({
            customId: `manage/application/youtuber/${member.id}/refuse`, 
            label: "Recusar",
            emoji: icon("close"), 
            style: ButtonStyle.Danger
        }),
    );

    return { embeds: [embed], components: [row] };
}