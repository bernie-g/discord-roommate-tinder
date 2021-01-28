import { config } from ".";
import { Sequelize } from "sequelize-typescript";
import Person from "./models/database/Person";
export let sequelize: Sequelize;

export default async function initialize() {
  sequelize = new Sequelize(config.database.connectionUrl, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
  sequelize.addModels([Person]);
  Person.sync();

  try {
    await sequelize.authenticate();
    console.log("Connection to database has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export async function getUser(userId: string): Promise<Person | null> {
  return await Person.findOne({ where: { userId: userId } });
}
