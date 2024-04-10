import { Component, Modal } from "#base";
import { db } from "#database";
import { icon } from "#functions";
import { menus } from "#menus";
import { settings } from "#settings";
import { brBuilder, createEmbed, createModalInput, createRow, findChannel, findMember, toNull } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, ComponentType, inlineCode, ModalBuilder, roleMention, TextInputStyle } from "discord.js";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(4, "O nome deve ter mais que 3 caracteres!"),
    channel: z.string().url("Você inseriu uma url inválida!")
});

type FormSchema = z.infer<typeof formSchema>;

function youtubersModal(action: string, data: Partial<FormSchema> = {}){
    return new ModalBuilder({
        customId: `form/youtubers/${action}`,
        title: "Aplicar para youtuber",
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
                customId: "channel",
                label: "Canal",
                placeholder: "Digite a url do seu canal do youtube",
                style: TextInputStyle.Short,
                value: data.channel,
                required,
            }),
        ]
    });
}

new Component({
    customId: "form/youtubers/:action/:[data]",
    type: ComponentType.Button, cache: "cached",
    run(interaction, { action, data }) {
        if (action === "open"){
            interaction.showModal(youtubersModal(action));
            return;
        }
        const [name, channel] = data;
        interaction.showModal(youtubersModal(action, { name, channel }));
    },
});

new Modal({
    customId: "form/youtubers/:action",
    cache: "cached", isFromMessage: true,
    async run(interaction, { action }) {
        const { member, guild, fields } = interaction;

        action === "open"
        ? await interaction.deferReply({ ephemeral })
        : await interaction.deferUpdate();

        const guildData = await db.guilds.get(guild.id);
        const channelId = guildData.channels?.forms?.id;
        if (!channelId || !guild.channels.cache.has(channelId)){
            const embed = createEmbed({
                color: settings.colors.danger,
                description: `${icon("close")} Este sistema não está configurado!`
            });
            interaction.editReply({ embeds: [embed] });
            return;
        }

        const roleId = guildData.roles?.youtuber?.id??"";
        if (member.roles.cache.has(roleId)){
            const embed = createEmbed({
                color: settings.colors.danger,
                description: `${icon("close")} Você já tem o cargo ${roleMention(roleId)}!`
            });
            interaction.editReply({ embeds: [embed] });
            return;
        }

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
                    customId: `form/youtubers/retry/${Object.values(rawData).join(",")}`,
                    label: "Tentar novamente",
                    style: ButtonStyle.Primary,
                    emoji: icon("next")
                })
            );

            interaction.editReply({ embeds: [embed], components: [row] });
            return;
        }

        const embed = createEmbed({
            color: settings.colors.success,
            description: brBuilder(
                `${icon("check")} Formulário enviado com sucesso!`,
                "Nossa equipe irá avaliar se você cumpre os requisitos",
                "e breve você terá uma resposta."
            )
        });
        interaction.editReply({ embeds: [embed], components: [] });

        const channel = findChannel(guild).byId(channelId)!;
        channel.send(menus.youtubers.manage(member, parsedResult.data));
    },
});

new Component({
    customId: "manage/application/youtuber/:mentionId/:action",
    type: ComponentType.Button, cache: "cached",
    async run(interaction, { mentionId, action }) {
        const { guild } = interaction;

        await interaction.deferUpdate();
        const mention = findMember(guild).byId(mentionId);
        if (!mention){
            const embed = createEmbed({
                color: settings.colors.danger,
                description: `${icon("close")} O membro não foi encontrado no servidor!`,
            });
            interaction.editReply({ embeds: [embed], components: [] });
            return;
        }

        const guildData = await db.guilds.get(guild.id);
        const roleId = guildData.roles?.youtuber?.id;
        if (!roleId || !guild.roles.cache.has(roleId)){
            const embed = createEmbed({
                color: settings.colors.danger,
                description: `${icon("close")} O cargo de youtuber não está configurado!`,
            });
            interaction.followUp({ ephemeral, embeds: [embed] });
            return;
        }

        if (action === "refuse"){
            const embed = createEmbed({
                color: settings.colors.danger,
                description: `${icon("close")} O formulário de ${mention} foi recusado!`,
            });
            interaction.editReply({ embeds: [embed], components: [] });

            embed.setDescription(
                `${icon("close")} O seu formulário de aplicação para youtuber foi recusado!`
            );

            mention.send({ embeds: [embed] }).catch(toNull);
            return;
        }

        const embed = createEmbed({
            color: settings.colors.success,
            description: `${icon("check")} O formulário de ${mention} foi aprovado!`,
        });
        interaction.editReply({ embeds: [embed], components: [] });

        embed.setDescription(
            `${icon("check")} O seu formulário de aplicação para youtuber foi aprovado!`
        );

        mention.send({ embeds: [embed] }).catch(toNull);
        mention.roles.add(roleId);
    },
});