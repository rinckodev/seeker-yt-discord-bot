import { Command } from "#base";
import { ApplicationCommandType } from "discord.js";
import { registerModal } from "../../modals/index.js";

new Command({
    name: "registrar",
    description: "Exibe o formulário de registro",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        
        interaction.showModal(registerModal());

    }
});