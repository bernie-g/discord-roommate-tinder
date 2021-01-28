import {
  DMChannel,
  Message,
  MessageEmbed,
  MessageReaction,
  User,
} from "discord.js";
import {
  ReactQuestion,
  TextQuestion,
  TextQuestionType,
} from "./models/dialogues";
import { EMBED_COLOR } from "./settings";

export function createEmbed(title: string, text: string): MessageEmbed {
  return new MessageEmbed()
    .setColor(EMBED_COLOR)
    .setTitle(title)
    .setDescription(text);
}

export async function createTextQuestion<T extends TextQuestionType>(
  question: TextQuestion<T>,
  dmChannel: DMChannel,
  sentMessages: Array<Message>,
  author: User
): Promise<T | null> {
  const embed = createEmbed(question.title, question.text);
  const message = await dmChannel.send(embed);
  sentMessages.push(message);
  const filter = (response: Message) => {
    return (
      response.author.id === author.id &&
      !!question.validator?.call(question, response.content)
    );
  };
  const promise = dmChannel.awaitMessages(filter, {
    max: 1,
    time: 120000,
    errors: ["time"],
  });
  return new Promise<T | null>((resolve, reject) => {
    // await here
  });
}

export async function createReactQuestion<T>(
  reactMessage: ReactQuestion<T>,
  dmChannel: DMChannel,
  sentMessages: Array<Message>,
  author: User
): Promise<T | null> {
  const embed = new MessageEmbed()
    .setColor(EMBED_COLOR)
    .setTitle(reactMessage.title);
  let description = reactMessage.text + "\n\n";
  Object.keys(reactMessage.reactions).forEach((emoji) => {
    description += `${emoji} - **${reactMessage.reactions[emoji].description}**\n\n`;
  });
  embed.setDescription(description);
  const message = await dmChannel.send(embed);
  sentMessages.push(message);

  Object.keys(reactMessage.reactions).forEach(async (emoji) => {
    await message.react(emoji);
  });

  const filter = (reaction: MessageReaction, user: User) => {
    return (
      typeof reactMessage.reactions[reaction.emoji.name] !== "undefined" &&
      user.id === author.id
    );
  };
  const reactionPromise = message.awaitReactions(filter, {
    time: 60000,
    max: 1,
    errors: ["time"],
  });

  return new Promise<T | null>((resolve, reject) => {
    reactionPromise
      .then((collected) => {
        if (collected.size !== 0) {
          resolve(
            reactMessage.reactions[collected.first()?.emoji.name as string]
              .value
          );
        } else {
          resolve(null);
        }
      })
      .catch((_) => {
        dmChannel.send(
          createEmbed(
            "Profile Creation",
            "Sorry, there has been an error! This is our fault!"
          )
        );
        reject(null);
      });
  });
}
