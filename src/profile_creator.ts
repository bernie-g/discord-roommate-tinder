import { DMChannel, Message, User } from "discord.js";
import { config } from ".";
import { createEmbed, createReactQuestion } from "./embed_utils";
import Person from "./models/database/Person";
import { GENDER_REACT, ReactQuestion } from "./models/dialogues";

export class ProfileCreator {
  sentMessages: Array<Message> = [];
  user: User;
  dmChannel: DMChannel;

  constructor(user: User) {
    this.user = user;
  }

  public async createProfile() {
    this.dmChannel = await this.user.createDM();
    this.sendDM(
      "Profile Creation",
      `Welcome to ${config.college.fullName}'s Roommate Matcher! I'm going to ask you a few questions about yourself and I'll start matching you with potential roommates!`
    );
    await sleep(5000);
    const gender = await this.createReactEmbed(GENDER_REACT);
    console.log(gender);
  }

  private async createReactEmbed<T>(reactionMessage: ReactQuestion<T>) {
    return createReactQuestion(
      reactionMessage,
      this.dmChannel,
      this.sentMessages,
      this.user
    );
  }

  private async sendDM(title: string, text: string) {
    const message = await this.dmChannel.send(createEmbed(title, text));
    this.sentMessages.push(message);
  }

  public async deleteProfile(user: User) {
    await Person.destroy({ where: { userId: user.id } });
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
