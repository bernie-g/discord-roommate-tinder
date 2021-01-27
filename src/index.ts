import { Client, DiscordAPIError } from "discord.js";

const client = new Client();

client.once("ready", () => console.log("Bot ready!"));
