import { Component, Modal } from "#base";
import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createModalInput, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, ComponentType, inlineCode, ModalBuilder, TextInputStyle } from "discord.js";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(4, "O nome deve ter mais que 3 caracteres!"),
    email: z.string().email("Você inseriu um email inválido!"),
    // eslint-disable-next-line camelcase
    age: z.coerce.number({ invalid_type_error: "A idade deve ser um número!" })
    .min(1, "Idade informada inválida")
});

type FormSchema = z.infer<typeof formSchema>;

export function registerModal(data: Partial<Record<keyof FormSchema, string>> = {}){
    return new ModalBuilder({
        customId: "form/register",
        title: "Formulário de registro",
        components: [
            createModalInput({
                customId: "name",
                label: "Nome",
                placeholder: "Digite seu nome",
                style: TextInputStyle.Short,
                value: data.name,
                required,
            }),
            createModalInput({
                customId: "email",
                label: "Email",
                placeholder: "Digite seu email",
                style: TextInputStyle.Short,
                value: data.email,
                required,
            }),
            createModalInput({
                customId: "age",
                label: "Idade",
                placeholder: "Digite sua idade",
                style: TextInputStyle.Short,
                value: data.age,
                required,
            }),
        ]
    });
}

new Component({
    customId: "form/register/:[data]",
    type: ComponentType.Button, cache: "cached",
    async run(interaction, { data }) {
        const [name, email, age] = data;
        interaction.showModal(registerModal({ name, email, age }));
    },
});

new Modal({
    customId: "form/register",
    cache: "cached",
    run(interaction) {
        const { fields } = interaction;

        const rawData = fields.fields.reduce(
            (prev, curr) => ({ ...prev, [curr.customId]: curr.value }), {}
        );

        const parsedResult = formSchema.safeParse(rawData);
        if (!parsedResult.success){
            const embed = createEmbed({
                color: settings.colors.danger,
                description: brBuilder(
                    `${icon("close")} O formulário tem campos incorretos!`,
                    parsedResult.error.errors.map(err => `- ${inlineCode(err.message)}`)
                )
            });

            const row = createRow(
                new ButtonBuilder({
                    customId: `form/register/${Object.values(rawData).join(",")}`,
                    label: "Tentar novamente",
                    style: ButtonStyle.Primary,
                    emoji: icon("next")
                })
            );

            const options = { ephemeral, embeds: [embed], components: [row] };        
            
            if (interaction.isFromMessage()){
                interaction.update(options);
                return;
            }
            interaction.reply(options);

            return;
        }

        const options = { ephemeral, content: "Formulário enviado", embeds: [], components: [] };
        
        console.log(parsedResult.data);
        
        if (interaction.isFromMessage()){
            interaction.update(options);
            return;
        }
        interaction.reply(options);
    },
});