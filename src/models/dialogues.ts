export interface ReactOptions<T> {
  [emoji: string]: ReactOption<T>;
}

export interface ReactOption<T> {
  description: string;
  value: T;
}

export interface ReactQuestion<T> {
  title: string;
  text: string;
  reactions: ReactOptions<T>;
}

export interface TextQuestion<T extends TextQuestionType> {
  title: string;
  text: string;
  type: T;
  validator?: (message: string) => boolean;
}

export type TextQuestionType = "integer" | "text" | EnumQuestionType;

export class EnumQuestionType {
  public values: string[];
  constructor(...values: string[]) {
    this.values = values;
  }
}

enum Gender {
  MALE,
  FEMALE,
  OTHER,
}

export const GENDER_REACT: ReactQuestion<Gender> = {
  title: "Profile Creation",
  text: "Let's get started! First of all, what's your gender?",
  reactions: {
    "♂️": { description: "Male", value: Gender.MALE },
    "♀️": { description: "Female", value: Gender.FEMALE },
    "🔢": { description: "Other", value: Gender.OTHER },
  },
};

export const MAJOR_QUESTION: TextQuestion = {
  title: "Profile Creation",
  text: "Great! What's your intended major?",
  type: "text",
  validator: (msg) => msg.length < 100,
};
