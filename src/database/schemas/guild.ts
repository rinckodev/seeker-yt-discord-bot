import { Schema } from "mongoose";
import { t } from "../utils.js";

const channelInfo = new Schema({ id: t.string, url: t.string }, { _id: false });
const roleInfo = new Schema({ id: t.string, name: t.string }, { _id: false });

export const guildSchema = new Schema(
    {
        id: t.string,
        channels: {
            logs: channelInfo,
            general: channelInfo,
            forms: channelInfo,
            promotion: channelInfo,
        },
        roles: {
            admin: roleInfo,
            mod: roleInfo,
            member: roleInfo,
            youtuber: roleInfo
        }
    },
    {
        statics: {
            async get(id: string) {
                return await this.findOne({ id }) ?? this.create({ id });
            }
        }
    }
);