import { channelMention, roleMention } from "discord.js";

export function formatedChannelMention(id: string | null | undefined, alt=""){
    return id ? channelMention(id) : alt;
}

export function formatedRoleMention(id: string | null | undefined, alt=""){
    return id ? roleMention(id) : alt;
}