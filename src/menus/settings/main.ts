import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, Guild } from "discord.js";

export function settingsMainMenu(guild: Guild){

    const embed = createEmbed({
        color: settings.colors.primary,
        thumbnail: guild.iconURL(),
        description: brBuilder(
            `# ${icon("gear")} Painel de configurações`,
            "",
            "- #️⃣ Configurar canais",
            "- 📄 Configurar cargos",
        ),
        footer: {
            text: `Configurações de ${guild.name}`,
            iconURL: guild.iconURL()
        }
    });

    const row = createRow(
        new ButtonBuilder({
            customId: "menu/settings/channels",
            label: "Canais", emoji: "#️⃣",
            style: ButtonStyle.Secondary
        }),
        new ButtonBuilder({
            customId: "menu/settings/roles",
            label: "Cargos", emoji: "📄",
            style: ButtonStyle.Secondary
        }),
    );


    return { ephemeral, embeds: [embed], components: [row] };
}