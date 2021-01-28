import {
  AllowNull,
  Column,
  Max,
  Min,
  Model,
  Table,
  Unique,
} from "sequelize-typescript";
import { DataTypes } from "sequelize";

export type Gender = "MALE" | "FEMALE";

@Table
export default class Person extends Model {
  public constructor(init?: Partial<Person>) {
    super();
    Object.assign(this, init);
  }

  @AllowNull(false)
  @Unique
  @Column
  public userId: string;

  @Column(DataTypes.ENUM("MALE", "FEMALE"))
  public gender: Gender;

  @Column
  public major: string;

  @Max(25)
  @Min(22)
  @Column
  public graduatingClass: number;

  @Max(100)
  @Min(14)
  @Column
  public age: number;

  @Column
  public sleepHabits: string;

  @Column
  public aboutMe: string;

  @Column
  public extraInfo: string;
}
