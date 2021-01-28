import { Client, DiscordAPIError, Message, Snowflake } from "discord.js";
import initialize_databse, { getUser } from "./data_manager";
import { createEmbed } from "./embed_utils";
import { Config } from "./models/config";
import { ProfileCreator } from "./profile_creator";

export const config: Config = require("../botconfig.json");

initialize_databse();

const client = new Client({
  presence: { activity: { type: "CUSTOM_STATUS", name: "roommate tinder!" } },
});

client.once("ready", () => console.log("Bot ready!"));
client.login(config.token);

client.on("message", async (message) => {
  const person = await getUser(message.author.id);
  const profileCreator = new ProfileCreator(message.author);
  if (message.content === "!profile") {
    message.channel
      .send(
        person === null
          ? createEmbed("Profile", "Creating a new profile!")
          : createEmbed("Profile", "You've already created a profile!")
      )
      .then((response) => {
        if (person === null) {
          profileCreator.createProfile();
        }
        setTimeout(() => {
          response.delete();
          message.delete();
        }, 5000);
      });
  }
  if (message.content === "!clear-profile") {
    message.channel
      .send(
        person === null
          ? createEmbed("Profile", "You don't have a profile setup yet!")
          : createEmbed(
              "Profile",
              "Deleted your profile! Make a new one with `!profile`"
            )
      )
      .then((response) => {
        if (person !== null) {
          profileCreator.deleteProfile(message.author);
        }
        setTimeout(() => {
          response.delete();
          message.delete();
        }, 5000);
      });
  }

  if (message.content === "!clear-dms") {
    const dmChannel = await message.author.createDM();
    const msgs = await dmChannel.messages.fetch();
    msgs?.forEach(async (msg, _) => {
      if (msg.deletable) await msg.delete();
    });
  }
});
