import { icon } from "#functions";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export const settingsNav = {
    main: new ButtonBuilder({
        customId: "menu/settings/main",
        label: "Menu principal",
        style: ButtonStyle.Danger,
        emoji: icon("home")
    }),
    back: (menu: string) => new ButtonBuilder({
        customId: `menu/settings/${menu}`,
        label: "Voltar",
        style: ButtonStyle.Danger,
        emoji: icon("previous")
    })
};