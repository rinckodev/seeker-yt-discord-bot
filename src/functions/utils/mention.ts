import { channelMention } from "discord.js";

export function formatedChannelMention(id: string | null | undefined, alt=""){
    return id ? channelMention(id) : alt;
}